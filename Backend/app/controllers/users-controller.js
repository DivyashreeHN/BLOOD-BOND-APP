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
       
        
        const user=new User(body) 
        if(count>=1&&body.role=='admin')
        {
            return res.status(400).json({ 
                errors: [{ msg: 'you are not authorized to access this role'}] 
            });
            
        }
        if(count===0)
        {
            user.role='admin'
        }
        else{
            user.role=body.role
        }
        const salt= await bcryptjs.genSalt()
        const encriptedPassword=await bcryptjs.hash(user.password,salt)
        user.password=encriptedPassword
        await user.save()  
        res.status(201).json(user)

    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({errors:[{msg:'Internal Server Error'}]})
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
            return res.status(404).json({errors:[{msg:'invalid email/password'}]})
        }
        const checkPassword=await bcryptjs.compare(body.password,user.password)
        if(!checkPassword)
        {
            return res.status(404).json({errors:[{msg:'invalid email/password'}]})
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
        return res.status(500).json({errors:[{msg:'Internal Server Error'}]})
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
        res.status(500).json({errors:[{msg:'Internal Server Error'}]})
    }

}

module.exports=userCltr
