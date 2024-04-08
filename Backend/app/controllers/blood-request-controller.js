const {validationResult}=require('express-validator')
const BloodRequest=require('../models/bloodRequest-model')
const Profile = require('../models/userProfile-model')
const bloodRequestCltr={}

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
    const bloodRequest= new BloodRequest(body)
    if(body.requestType=="both")
    {
        bloodRequest.requestType=['user','bloodbank']
    }
    
    bloodRequest.user=req.user.id
    await bloodRequest.save()
    res.json(bloodRequest)
    }
    catch(err)
    {
        res.status(500).json({error:'internal server error'})
    }
}

//displaying blood request according to user address and bloodgroup so user can see request for matching his address and bloodgroup
bloodRequestCltr.display=async(req,res)=>
{
    try{
    const personDetails=await Profile.findOne({user:req.user.id})
    console.log(personDetails)
   
    if(!personDetails)
    {
        return res.status(404).json({error:'Profile not found' }); 
    }

    const bloodRequestDetails=await BloodRequest.find({
        $and:[
            {donationAddress:personDetails.address},
            {bloodGroup:personDetails.bloodGroup},
            {user:{$ne:req.user.id}}
        ]
    })
    res.json(bloodRequestDetails)
}
    catch(err)
    {
        console.log('error',err)
        res.status(500).json({error:'internal server error'})
    }
}

//the user can see all the requests comes to user only not bloodbank irrespective of his bloodgroup and address he can get all the requests
bloodRequestCltr.list=async(req,res)=>
{
    console.log(req.user.role)
    try{
    const bloodRequestType=await BloodRequest.find({
      requestType:req.user.role     
    })
    console.log(bloodRequestType)
    if (bloodRequestType.length===0) 
    {
        return res.status(404).json({error:'No blood requests found'});
    }
    res.json(bloodRequestType) 
}
catch(err)
{
    res.status(500).json({error:'internal server error'})
}
}

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
module.exports=bloodRequestCltr
