const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const User=require('../models/user-model')
const {validationResult}=require('express-validator')


const userCltr={}

userCltr.register=async(req,res)=>
{
    const errors=validationResult(req)
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const body=req.body
        const count=await User.countDocuments()
        //console.log(count)
        if(count===0)
        {
            req.body.role='admin'
        }
        const user=new User(body) 
        const salt= await bcryptjs.genSalt()
        const encriptedPassword=await bcryptjs.hash(user.password,salt)
        user.password=encriptedPassword
        await user.save()  
        res.status(201).json(user)

    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({notice:'internal server error'})
    }
}

userCltr.login=async(req,res)=>
{
    const errors=validationResult(req)
        if(!errors.isEmpty())
        {
            return res.status(400).json({errors:errors.array()})
        }
        try{
        const {body}=req
        const user=await User.findOne({email:body.email})
        if(!user)
        {
            return res.status(404).json({error:'invalid email'})
        }
        const checkPassword=await bcryptjs.compare(body.password,user.password)
        if(!checkPassword)
        {
            return res.status(404).json({notice:'invalid password'})
        }
        const tokenData={
            id:user._id,
            role:user.role

        }
        const token=jwt.sign(tokenData,process.env.JWT_SECRET,{expiresIn:'14d'})
        res.json({token:token})
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).json({notice:'internal server error'})
    }
    }
    
userCltr.account=async(req,res)=>
{
    try{
    const user=await User.findById(req.user.id)
    res.json(user)
    }
    catch(err)
    {
        res.status(500).json({error:'internal server error'})
    }

}

module.exports=userCltr