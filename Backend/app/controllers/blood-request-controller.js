const {validationResult}=require('express-validator')
const BloodRequest=require('../models/bloodRequest-model')
const Profile = require('../models/userProfile-model')
const BloodBank=require('../models/bloodBankModel')
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
        // Fetch the user's profile details
        const personDetails = await Profile.findOne({ user: req.user.id });
        if (!personDetails) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        // Find blood requests that match the user's profile
        const bloodRequestDetails = await BloodRequest.find({
            $and: [
                { 'donationAddress.pincode': personDetails.address.pincode },
                { 'blood.bloodGroup': personDetails.blood.bloodGroup },
                { 'requestType': { $in: [req.user.role, 'both'] } },
                { user: { $ne: req.user.id } }
            ]
        });

        console.log('Blood requests matching user profile:', bloodRequestDetails);

        const matchingRequests = [];

        // Loop through each matching blood request
        for (const request of bloodRequestDetails) {
            // Check for existing responses for this request by the current user
            const existingResponse = await Response.findOne({ bloodRequestId: request._id, responderId: personDetails._id });

            if (existingResponse) {
                // If the user responded as 'rejected', delete the response
                if (existingResponse.status === 'rejected') {
                    await Response.deleteOne({ _id: existingResponse._id });
                } else if (existingResponse.status === 'accepted') {
                    // If the user responded as 'accepted', add the request to matching requests and skip further checks
                    matchingRequests.push(request);
                    continue;
                }
            }

            // Get all responses for the current request
            const responses = await Response.find({ bloodRequestId: request._id });

            // Check if there are any accepted responses by other users
            const hasAcceptedResponse = responses.some(response => response.status === 'accepted' && response.responderId.toString() !== personDetails._id.toString());

            // If no other user has accepted the request, add to matching requests
            if (!hasAcceptedResponse) {
                matchingRequests.push(request);
            }
        }

        // If no matching requests are found, send a message
        if (matchingRequests.length === 0) {
            return res.json({ error: 'No matching requests found' });
        }

        // Send the matching requests to the user
        res.json(matchingRequests);
    } catch (err) {
        
        console.log('error', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};



//user can see his request
bloodRequestCltr.listMyRequest=async(req,res)=>
    {
        try{
            const bloodRequest=await BloodRequest.find({user:req.user.id})
            if(!bloodRequest)
                {
                    return res.status(404).json({error:'he did not request for Any blood'})
                }
                res.json(bloodRequest)
        }
        catch(err)
        {
            res.status(500).json({error:'internal server error'})
        }
    }

    
//the user can see all the requests comes to user only, not bloodbank irrespective of his bloodgroup and address he can get all the requests
bloodRequestCltr.list=async(req,res)=>
{
    
    try {
        const profile = await Profile.findOne({ user: req.user.id });
  
        if (!profile) {
          return res.status(404).json({ error: 'Profile not found' });
        }
  
        const bloodRequests = await BloodRequest.find({
          $and: [
            { 'donationAddress.country': profile.address.country },
            { 'requestType': { $in: [req.user.role] } },
            { user: { $ne: req.user.id } },
            { 'donationAddress.pincode': { $ne: profile.address.pincode } },
            { 'blood.bloodGroup': { $ne: profile.blood.bloodGroup } }
          ]
        });
  
        if (!bloodRequests.length) {
          return res.status(404).json({ error: 'No blood requests found' });
        }
  
        const otherResponses = [];
  
        for (const request of bloodRequests) {
          const response = await Response.findOne({ bloodRequestId: request._id });
  
          if (!response) {
            otherResponses.push(request);
          }
        }
  
        if (otherResponses.length==0) {
          return res.status(404).json({ error: 'No other blood requests found' });
        }
  
        res.json(otherResponses);
      } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  

//it display the if requestType is bloodbank it will diplayed to bloodbank edition

    bloodRequestCltr.listToBloodBank=async(req,res)=>
        {
            try{
                const bloodbank=await BloodBank.findOne({user:req.user.id})
               
                if(!bloodbank)
                {
                    return res.status(404).json({error:'bloodbank not found'})
                }
                console.log('User role:', req.user.role);
                console.log('Blood bank city:', bloodbank.address.city);
                const bloodRequestType=await BloodRequest.find({
                    $and: [
                        { 'donationAddress.city': bloodbank.address.city },
                        {'requestType':{$in : [req.user.role, 'both']}  } 
                    ]
                })
                // console.log('bloodrequest',bloodRequestType)
            
                
                if (bloodRequestType.length===0) 
                {
                    return res.status(404).json({errors:[{msg:'No blood requests found222'}]});
                }
                res.json(bloodRequestType) 
            }
                
            catch(err)
            {
                console.log(err)
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
