const {validationResult}=require('express-validator')
const responseCtrl={}
const BloodRequest=require('../models/bloodRequest-model')
const Response = require('../models/responseModel')
const bloodRequestCltr = require('../controllers/blood-request-controller');
const Profile=require('../models/userProfile-model')
const BloodBank=require('../models/bloodBankModel')



//RESPONSE BY ADMIN

responseCtrl.create = async (req, res) => { 
    const id=req.user.id
    const responderType=req.user.role
    console.log(req.user.role)
    console.log(req.user.id)
    try
     {
        let responder
        if(responderType=='bloodbank'){
            responder=await BloodBank.findOne({user:id})
        }
        else{
            responder=await Profile.findOne({user:id})
        }
        console.log('Responder:', responder);

        if (!responder) {
            return res.status(404).json({ errors: 'Responder not found' });
        }
        const response=await Response.findOne({bloodRequestId:req.params.requestId,responderId:responder._id})
        if(response){
            return res.status(400).json({errors:'You have already responded for this request'})
        }
            
                const newResponse = new Response({
                    bloodRequestId:req.params.requestId,
                    responderId:responder._id,
                    responderType,
                    status: "accepted",
                })
                await newResponse.save();
                 res.status(201).json(newResponse)
            
        
    } 
    catch (err) 
    {
        console.log(err)
       res.status(500).json({ error: 'Internal server error' })
    }
}


//USER CAN ACCEPT THE REQUEST OR REJECT THE REQUEST


responseCtrl.userResponse = async (req, res) => { 
    const id = req.params.id;
    try {
        const errors = await validationResult(req)
        if (!errors.isEmpty()) 
        {
            return res.status(400).json({errors:errors.array()})
        }
        const response=await Response.findOne({bloodRequestId:id})
        if(response.responderId==req.user.id)
        {
           res.status(400).json({error:'you already responded'})
        }
        response.status=req.body.status;
        response.responderId=req.user.id;
        response.responderType=req.user.role;
        response.bloodRequestId=id;
        await response.save()
        res.json(response)
        }
        catch(err) 
        {
        console.log(err)
        return res.status(500).json({ error: 'internal server error' });
        }
};

module.exports=responseCtrl