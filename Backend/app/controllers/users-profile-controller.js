const {validationResult}=require('express-validator')
const Profile = require('../models/userProfile-model')
const _=require('lodash')
const axios=require('axios')
const { lastName } = require('../validators/userProfile-validation-schema')



const userProfilecltr={}

userProfilecltr.create=async(req,res)=>
{
    const errors=validationResult(req)
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const {body}=req
        console.log('body',body)
    const userId=await Profile.findOne({user:req.user.id})
     if(userId)
     {
        return res.status(400).json({error:'user cannot create more than one profile'})
     } 
    
   
    const address=_.pick(req.body.address,['building','locality','city','state','pincode','country'])
        const searchString=`${address.building}%2C%20${address.locality}%2C%20${address.city}%2C%20${address.state}%2C%20${address.pincode}%2C%20${address.country}`
        const mapResponse=await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${searchString}&apiKey=${process.env.GEOAPIFYKEY}`)
        
        if(mapResponse.data.features.length==0){
            return res.status(400).json({errors:[{msg:"Invalid address",path:"Invalid address"}]})
        }
        const {features}=mapResponse.data
        console.log(features[0])
        const {lon,lat}=features[0].properties

        const profile=new Profile({
            ...body,
            address:req.body.address,
            lastName:"hn",
            geoLocation:{
                type:'Point',
                coordinates:[lon,lat]
            }
        })
        console.log('lastname',lastName)
        profile.user=req.user.id
        await profile.save()
    res.status(201).json(profile)
    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({notice:'internal server error'})
    }
}




//user prfoile for displaying it to admin
userProfilecltr.display=async(req,res)=>
{
    try{
    const profile=await Profile.find()
    res.json(profile)
    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({error:'internal server error'})
    }

}

//to display particular user profile
// userProfilecltr.show=async(req,res)=>
// {
//     const profile=await Profile.findOne({user:req.user.id})
//     console.log(profile)
//     if(!profile)
//     {
//         throw new Error('profile not found')
//     }
//     res.json(profile)

// }
userProfilecltr.show=async(req,res)=>{
    const userID=req.user.id
    try{
        const profile=await Profile.find({user:userID})
        res.status(201).json(profile)
        console.log('single profile from backend',profile)
    }catch(err){
        console.log(err)
       
        res.status(500).json({error:'Internal Server Error'})
    }
}


//user can update his profile only
userProfilecltr.update=async(req,res)=>
{
    const errors=validationResult(req)
        if(!errors.isEmpty())
        {
            return res.status(400).json({errors:errors.array()})
        }
        const id=req.params.id
        const body=req.body
        try{
        const profile=await Profile.findOne({_id:id})
        if(!profile)
        {
           throw new Error('your profile not found')
        }
        if(profile.user==req.user.id)
        {
        const updatedProfile=await Profile.findByIdAndUpdate(id,body,{new:true,runValidators:true})
        res.json(updatedProfile)
        console.log(updatedProfile) 
        }
        else{
            res.status(400).json({error:'your are not authorised to  edit this profile'})
        }
     
    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({error:'internal server error'})
    }
}

//user can delete his profile only
userProfilecltr.delete=async(req,res)=>
{
    const id =req.params.id
    console.log(id)
    try{
    const profile=await Profile.findOne({_id:id})
    console.log(profile)
    if(!profile)
    {
        res.status(400).json({error:'profile not found'})
    }
    if(profile.user==req.user.id)
    { 
    const deletedProfile=await Profile.findByIdAndDelete(id)
    res.json(deletedProfile)
    }
   else{
    res.status(404).json({error:'You are not having permission to delete this profile'})
   }
}
catch(err)
{
    console.log(err)
    res.status(500).json({error:'internal server error'})
}
}
module.exports=userProfilecltr