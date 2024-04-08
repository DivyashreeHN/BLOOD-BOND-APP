const jwt=require('jsonwebtoken')
const User=require('../models/user-model')

const authenticateUser=(req,res,next)=>
{
    const token=req.headers['authorization']
    if(!token)
    {
        return res.status(401).json({error:'token required'})
    }
    try{
    const tokenData=jwt.verify(token,process.env.JWT_SECRET)
    // console.log(tokenData)
    req.user={
        id:tokenData.id,
        role:tokenData.role
    }
    next()
}
catch(err)
{
    console.log(err)
    res.status(401).json({error:err.message})

}
}
const authorizeUser=(permittedRole)=>
{
    return(req,res,next)=>
    {
        if(permittedRole.includes(req.user.role))
        {
            next()
        }
        else{
            return res.status(404).json({error:'you are not authorized to access this'})
        }

    }
}



module.exports={authenticateUser,authorizeUser}