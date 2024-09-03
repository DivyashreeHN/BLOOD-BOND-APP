const BloodBank=require('../models/bloodBankModel')
const BloodInventory=require('../models/bloodInventoryModel')
const {validationResult}=require('express-validator')
const bloodInventoryCtrlr={}
bloodInventoryCtrlr.create=async(req,res)=>{
const errors=validationResult(req)
if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
}
try{
    const bloodBank=await BloodBank.findOne({_id:req.params.id})
    if(!bloodBank){
        throw new Error('BloodBank does not exist')
    }
    const {body}=req
   
   const bloodInventory=new BloodInventory(body)
   if(body.blood.bloodType=='plasma'||body.blood.bloodType=='wholeBlood'){
    bloodInventory.expirationCount=365
   }
   else if(body.blood.bloodType=='platelets'){
    bloodInventory.expirationCount=6
   }
   else{
    bloodInventory.expirationCount=40
   }
   const date=new Date(body.donationDate)
   date.setDate(date.getDate()+Number(bloodInventory.expirationCount))
   bloodInventory.expiryDate=date.toISOString().split('T')[0]
   bloodInventory.bloodBank=req.params.id
   bloodInventory.user=req.user.id
    bloodInventory.status="available"
     await bloodInventory.save()
    res.status(201).json(bloodInventory)
}catch(err){
    console.log(err)
    res.status(500).json({error:'Internal Server Error'})
}
}
bloodInventoryCtrlr.list=async(req,res)=>{
    const filters=req.query
    const page=parseInt(filters.page)||1
    const limit=parseInt(filters.limit)||10
    const skip=(page-1)*limit
        console.log('incoming filters', filters)
        const query={}
    try{
        const id=req.params.id
        if (filters.bloodGroup) {
            query['blood.bloodGroup'] = new RegExp(filters.bloodGroup, 'i');
        }
        if (filters.bloodType) {
            query['blood.bloodType'] = new RegExp(filters.bloodType, 'i');
        }
        if (filters.status) query.status=new RegExp(filters.status,'i')
            const expiryDate = filters.expiryDate;
        if (expiryDate && expiryDate.trim() !== '' && !isNaN(Date.parse(expiryDate))) {
            query.expiryDate = new Date(expiryDate);
        }
        console.log('query',query)
        let bloods=await BloodInventory.find({bloodBank:id})
        console.log('blood',bloods)
        const today = new Date();
        const updates = bloods.map(async (blood) => {
            if (blood.expiryDate < today) {
                return BloodInventory.updateOne(
                    { _id: blood._id },
                    { status: 'expired' }
                );
            }
        }).filter(update => update !== undefined);
        await Promise.all(updates)
        bloods = await BloodInventory.find({ bloodBank: id, ...query }).
        skip(skip).limit(limit)
        const totalBloods=await BloodInventory.countDocuments({bloodBank:id, ...query})
        res.status(201).json({
            bloods,
            totalBloods,
            totalPages:Math.ceil(totalBloods/limit),
            currentPage:page
        })
    }
    catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}
bloodInventoryCtrlr.delete=async(req,res)=>{
    try{
        const id=req.params.id
        const blood=await BloodInventory.findByIdAndDelete({_id:id})
        res.status(201).json(blood)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}
bloodInventoryCtrlr.update=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        console.log(req.params.id)
        const id =req.params.id
        const body=req.body
        console.log('id',id)
        const blood=await BloodInventory.findByIdAndUpdate({_id:id},body,{new:true})
        console.log(blood)
        res.status(201).json(blood)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}
module.exports=bloodInventoryCtrlr