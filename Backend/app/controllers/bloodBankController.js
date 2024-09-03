const {validationResult}=require('express-validator')
const BloodBank=require('../models/bloodBankModel')
const User=require('../models/user-model')
const Profile=require('../models/userProfile-model')
const axios=require('axios')
const _=require('lodash')
const BloodInventory=require('../models/bloodInventoryModel')
const bloodBankCtrlr={}
bloodBankCtrlr.create=async(req,res)=>{
    
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
   
    try{
        const {body}=req
        const {files}=req
        console.log('files', files)
        console.log('body', body)
        // console.log(req.file)
        const user=await BloodBank.findOne({user:req.user.id})
        
        if(user){
            return res.status(400).json({error:'each BloodBank can have only one profile'})
        }
        const registeredUser=await User.findById(req.user.id)
        const address=_.pick(req.body.address,['building','locality','city','state','pincode','country'])
        const searchString=`${address.building}%2C%20${address.locality}%2C%20${address.city}%2C%20$${address.state}%2C%20$${address.pincode}%2C%20${address.country}`
        const mapResponse=await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${searchString}&apiKey=${process.env.GEOAPIFYKEY}`) 
        if(mapResponse.data.features.length==0)
        {
            return res.status(400).json({errors:[{msg:"Invalid address",path:"Invalid address"}]})
        }
        const {features}=mapResponse.data
        console.log(features[0])
        const {lon,lat}=features[0].properties
        
        const bloodBank=new BloodBank({name:body.name,
            user:req.user.id,
        phoneNumber:body.phoneNumber,
        address:body.address,
        email:registeredUser.email,
        geoLocation:{
            type:'Point',
            coordinates:[lon,lat]
        },
        blood:body.blood,
        openingHours:{
            opensAt:{
                hour:body.openingHours.opensAt.hour,
                minutes:body.openingHours.opensAt.minutes,
                period:body.openingHours.opensAt.period
            },
            closesAt:{
                hour:body.openingHours.closesAt.hour,
                minutes:body.openingHours.closesAt.minutes,
                period:body.openingHours.closesAt.period
            }
        },
        services:body.services,
        isApproved:'pending',
        license:files.license&&files.license.map(files=>files.path),
        photos: files.photos&&files.photos.map(files=>files.path)
    })
        
        await bloodBank.save()
        res.status(201).json(bloodBank)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}
bloodBankCtrlr.display=async(req,res)=>{
    const userID=req.user.id
    try{
        const bloodBank=await BloodBank.find({user:userID, isApproved:'approved'})
        res.status(201).json(bloodBank)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}
bloodBankCtrlr.listForApproval=async(req,res)=>{
    try{
        const bloodBanks= await BloodBank.find({isApproved:'pending'})
        res.status(201).json(bloodBanks)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}
bloodBankCtrlr.toApprove=async(req,res)=>{
    const id=req.params.id
    const body=req.body
    try{
        const bloodBank=await BloodBank.findOne({_id:id})
        if(!bloodBank){
            res.status(401).json({error:'Blood bank does not exists'})
        }
        const approvedBloodbank=await BloodBank.findByIdAndUpdate(id,body,{new:true})
        res.status(201).json(approvedBloodbank)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}
bloodBankCtrlr.show=async(req,res)=>{
    try{
        const id=req.params.id
        const bloodBank=await BloodBank.findOne({_id:id})
        if(!bloodBank){
            throw new Error('Blood bank is not found/approved')
        }
        const availableBlood= await BloodInventory.find({bloodBank:id}).distinct('blood')
        
        bloodBank.availableBlood=availableBlood
        await bloodBank.save()
        res.status(201).json(bloodBank)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}
bloodBankCtrlr.listAll=async(req,res)=>{
    const filters=req.query
    console.log('filter',filters)
    const page=parseInt(filters.page)
    const limit=parseInt(filters.limit)
    const skip=(page-1)*limit
    try{
        const id=req.user.id
        const profile=await Profile.find({user:id})
        if(!profile){
            res.status(404).json({error:'Profile not found'})
        }
        const query={
            isApproved:'approved',
            'address.city':profile[0].address?.city
        }
        if(filters.name){
            query.name=new RegExp(filters.name,'i')
        }
        console.log('query',query)
        const totalBloodbanks=await BloodBank.countDocuments(query)
        const bloodBanks= await BloodBank.find(query).skip(skip).limit(limit)
        console.log('bb',bloodBanks)
        const totalPages = Math.max(Math.ceil(totalBloodbanks / limit), 1);
        res.status(200).json({
            bloodBanks,
            totalBloodbanks,
            currentPage:page,
            totalPages,
        })
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}
bloodBankCtrlr.delete=async(req,res)=>{
    try{
        const id=req.params.id
        const bloodbank=await BloodBank.findOne({_id:id})
        if(!bloodbank){
            throw new Error('This bloodBank already does not exist')
        }
        const bloodBank=await BloodBank.findByIdAndDelete({_id:id})
        res.status(500).json(bloodBank)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}
module.exports=bloodBankCtrlr