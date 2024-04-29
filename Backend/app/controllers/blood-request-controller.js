const {validationResult}=require('express-validator')
const BloodRequest=require('../models/bloodRequest-model')
const Profile = require('../models/userProfile-model')
const _=require('lodash')
const axios=require('axios')
const bloodRequestCltr={}
const Response=require('../models/responseModel')

//who has profile he can request for blood for multiple blood request
bloodRequestCltr.create=async(req,res)=>
  {
    const errors=validationResult(req)
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()})
    }
    const profile=await Profile.findOne({user:req.user.id})
    if(!profile)
    {
        res.status(400).json({error:'create profile for requesting blood'})
    }
    try{
    const body=req.body
    const address=_.pick(req.body.donationAddress,['building','locality','city','state','pincode','country'])
        const searchString=`${address.building}%2C%20${address.locality}%2C%20${address.city}%2C%20${address.state}%2C%20${address.pincode}%2C%20${address.country}`
        const mapResponse=await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${searchString}&apiKey=${process.env.GEOAPIFYKEY}`)
        
        if(mapResponse.data.features.length==0){
            return res.status(400).json({errors:[{msg:"Invalid address",path:"Invalid address"}]})
        }
        const {features}=mapResponse.data
        // console.log(features[0])
        const {lon,lat}=features[0].properties

        let requestType = body.requestType;
         if (requestType === "both") {
         requestType = ['user', 'bloodbank'];
          }
     const bloodRequest= new BloodRequest({
        ...body,
        requestType:requestType,
        address:address,
            geoLocation:{
                type:'Point',
                coordinates:[lon,lat]
            }
        })
    
    bloodRequest.user=req.user.id
    await bloodRequest.save()
    res.json(bloodRequest)
    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({error:'internal server error'})
    }
}

//displaying blood request according to user pincode,bloodgroup,requesttype,avoiding his request so user can see request for these matches
bloodRequestCltr.display = async (req, res) => {
    try {
        const personDetails = await Profile.findOne({ user: req.user.id });
        if (!personDetails) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        const bloodRequestDetails = await BloodRequest.find({
            $and: [
                { 'donationAddress.pincode': personDetails.address.pincode },
                { 'blood.bloodGroup': personDetails.blood.bloodGroup },
                { 'requestType': req.user.role },
                { user: { $ne: req.user.id } }
            ]
        });

        const pendingResponses = [];

        if (bloodRequestDetails) {
            for (const ele of bloodRequestDetails) {
                const response = await Response.findOne({ bloodRequestId: ele._id, responderId: req.user.id });

                // Check if the response exists and if it's pending or not responded
                if (!response || response.status === "pending") {
                    pendingResponses.push(ele);
                }
            }

            if (pendingResponses.length === 0) {
                return res.json({ error: 'There are no pending requests found' });
            }

            res.json(pendingResponses);
        }
    } catch (err) {
        console.log('error', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//the user can see all the requests comes to user only, not bloodbank irrespective of his bloodgroup and address he can get all the requests
bloodRequestCltr.list=async(req,res)=>
{
    
    try{
    const profile=await Profile.findOne({user:req.user.id})
    // console.log('profile',profile.address.country)
    // console.log('user',req.user.role)

    if(!profile)
    {
        return res.status(404).json({error:'profile not found'})
    }
   
    const bloodRequestType=await BloodRequest.find({
        $and: [
            { 'donationAddress.country': profile.address.country },
            {'requestType':{$in : req.user.role}  } 
        ]
    })
    // console.log('bloodrequest',bloodRequestType)

    
    if (bloodRequestType.length===0) 
    {
        return res.status(404).json({error:'No blood requests found222'});
    }
    res.json(bloodRequestType) 
}
    
catch(err)
{
    res.status(500).json({error:'internal server error'})
}
}

//it display the if requestType is bloodbank it will diplayed to bloodbank
// bloodRequestCltr.list=async(req,res)=>
// {
//     console.log(req.user.role)
//     try{
//     const bloodRequestType=await BloodRequest.find({
//       requestType:req.user.role     
//     })
//     // console.log(bloodRequestType)
//     if (bloodRequestType.length===0) 
//     {
//         return res.status(404).json({error:'No blood requests found'});
//     }
//     res.json(bloodRequestType) 
// }
// catch(err)
// {
//     res.status(500).json({error:'internal server error'})
// }
// }

//user can update his requests 
bloodRequestCltr.update=async(req,res)=>
{
    const errors=validationResult(req)
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()})
    }
    const id=req.params.id
    const body=req.body
    try{
    const profile=await Profile.findOne({user:req.user.id})
    if(!profile)
    {
        return res.status(400).json({error:'create profile to edit bloodRequest'})
    }
    const bloodRequest=await BloodRequest.findOne({_id:id})
    if(!bloodRequest)
    {
        res.status(400).json({error:'you are not requested for any blood'})
    }
    if(bloodRequest.user==req.user.id)
    {
        const updatedBloodRequest=await BloodRequest.findByIdAndUpdate(id,body,{new:true})
        res.status(201).json(updatedBloodRequest)
    }
    else{
        res.status(403).json({error:'u are not authorized to edit the request'})
    }
}
catch(err)
{
    res.status(500).json({error:'internal server error'})
}
}

//user can delete his request

bloodRequestCltr.delete=async(req,res)=>
{
    const id=req.params.id
    try{
        const bloodRequest=await BloodRequest.findOne({_id:id})
        if(!bloodRequest)
        {
            throw new Error('there is no request')
        }
        if(bloodRequest.user==req.user.id)
        {
            const deletedBloodRequest=await BloodRequest.findByIdAndDelete(id)
            res.status(201).json(deletedBloodRequest)
        }
        else{
            res.status(403).json({error:'you are not authorized to delete this request'})
        }
    }
    catch(err)
    {
        res.status(500).json({error:'internal servrer error'})
    }
}

//BLOODREQUEST viewed by admin
bloodRequestCltr.admin=async(req,res)=>
{
    try{
    const requests=await BloodRequest.find()
    res.json(requests)
    }
    catch(err)
    {
        return res.status(500).json({error:'internal server error'})
    }

}
module.exports=bloodRequestCltr
