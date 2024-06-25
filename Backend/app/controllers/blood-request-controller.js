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
        
 const personDetails = await Profile.findOne({ user: req.user.id });
        if (!personDetails) {
            return res.status(404).json({ error: 'Profile not found' });
        }


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

        for (const request of bloodRequestDetails) {
            
            const existingResponse = await Response.findOne({ bloodRequestId: request._id, responderId: personDetails._id });

            if (existingResponse) 
                {
                if (req.body.status === 'rejected') {
                    await Response.deleteOne({ _id: existingResponse._id });
                }
            }

        
    const responses = await Response.find({ bloodRequestId: request._id });

            const hasAcceptedResponse = responses.some(response => response.status === 'accepted');
            const isRejectedByUser = existingResponse && existingResponse.status === 'rejected';

            if (!hasAcceptedResponse && !isRejectedByUser)
                 {
                matchingRequests.push(request);
            }
        }

        if (matchingRequests.length === 0) {
            return res.json({ error: 'No matching requests found' });
        }

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

const BloodResponse = require('../models/responseModel')

bloodRequestCltr.listToBloodBank = async (req, res) => {
    try {
        const bloodbank = await BloodBank.findOne({ user: req.user.id });
        
        if (!bloodbank) {
            return res.status(404).json({ error: 'Blood bank not found' });
        }
        
        // Find blood requests based on city and request type
        const bloodRequestType = await BloodRequest.find({
            $and: [
                { 'donationAddress.city': bloodbank.address.city },
                { 'requestType': { $in: [req.user.role, 'both'] } }
            ]
        });
        console.log('requests', bloodRequestType)
        // If no blood requests found, return a 404 error
        if (bloodRequestType.length === 0) {
            return res.status(404).json({ errors: [{ msg: 'No blood requests found' }] });
        }

        // Filter blood requests based on whether there are responses from the blood bank
        const bloodRequestsWithoutResponses = await Promise.all(
    bloodRequestType.map(async (request) => {
        // Check if there's a response for this request from the blood bank
        const existingResponse = await BloodResponse.findOne({
            bloodRequestId: request._id,
            responderId: bloodbank._id
        });
        console.log('response',existingResponse)

        // Include request only if no response exists from the blood bank
        if (!existingResponse) {
            return request; // Include the request in the filtered array
        } 
    })
);
console.log('filtered',bloodRequestsWithoutResponses)

// Remove undefined elements from the array (requests with responses)
const filteredBloodRequests = bloodRequestsWithoutResponses.filter(Boolean);

        // If no requests remain after filtering, return a 404 error
        if (filteredBloodRequests.length === 0) {
            return res.json([])
        }

        // Return the filtered blood requests
        res.json(filteredBloodRequests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

        
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
