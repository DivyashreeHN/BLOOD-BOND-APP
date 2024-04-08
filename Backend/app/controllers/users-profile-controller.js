const {validationResult}=require('express-validator')
const Profile = require('../models/userProfile-model')

const userProfilecltr={}

userProfilecltr.create=async(req,res)=>
{
    const errors=validationResult(req)
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()})
    }
    const userId=await Profile.findOne({user:req.user.id})
     if(userId)
     {
        return res.status(400).json({error:'user cannot create more than one profile'})
     } 
    try{
    const body=req.body
    const profile=new Profile(body)
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
userProfilecltr.show=async(req,res)=>
{
    const profile=await Profile.findOne({user:req.user.id})
    console.log(profile)
    if(!profile)
    {
        throw new Error('profile not found')
    }
    res.json(profile)

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