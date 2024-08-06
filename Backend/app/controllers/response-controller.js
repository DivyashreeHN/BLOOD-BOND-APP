const {validationResult}=require('express-validator')
const responseCtrl={}
const BloodRequest=require('../models/bloodRequest-model')
const Response = require('../models/responseModel')
const bloodRequestCltr = require('../controllers/blood-request-controller');
const Profile=require('../models/userProfile-model')
const BloodBank=require('../models/bloodBankModel')
responseCtrl.create = async (req, res) => {
    const userId = req.user.id;
    const responderType = req.user.role;
    const { status } = req.body;

    try {
        let responder;

        if (responderType === 'bloodbank') {
            responder = await BloodBank.findOne({ user: userId });
        } else {
            responder = await Profile.findOne({ user: userId });
        }

        if (!responder) {
            return res.status(404).json({ errors: 'Responder not found' });
        }

        const response = await Response.findOne({ bloodRequestId: req.params.requestId, responderId: responder._id });

        if (response) {
            return res.status(400).json({ errors: 'You have already responded for this request' });
        }

        const newResponse = new Response({
            bloodRequestId: req.params.requestId,
            responderId: responder._id,
            responderType,
            status:"accepted"
        });

        await newResponse.save();

        res.status(201).json(newResponse);
    } catch (err) {
        console.error('Error occurred:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
responseCtrl.listOfBloodbank=async(req,res)=>{
    const id=req.params.requestId
    try{
        const responses=await Response.find({responderType:'bloodbank',bloodRequestId:id}).populate('responderId')
        if(responses.length==0){
            return res.status(400).json({errors:'zero responses from users for this request'})
        }
        const populatedResponses = await Promise.all(responses.map(async response => {
            const responseObject = response.toObject(); // Convert to plain JavaScript object
            responseObject.responderId = await BloodBank.findById(response.responderId).exec();
            return responseObject;
        }));
        res.status(201).json(populatedResponses)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server error'})
    }
}
responseCtrl.listOfUser=async(req,res)=>{
    const id=req.params.requestId
    try{
        const responses=await Response.find({responderType:'user',bloodRequestId:id}).populate('responderId')
        if(responses.length===0){
            return res.status(400).json({errors:'zero responses from users for this request'})
        }
        const populatedResponses = await Promise.all(responses.map(async response => {
            const responseObject = response.toObject(); // Convert to plain JavaScript object
            responseObject.responderId = await Profile.findById(response.responderId).exec();
            return responseObject;
        }));
        res.status(201).json(populatedResponses)
        
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server error'})
    }
}
// //USER CAN ACCEPT THE REQUEST OR REJECT THE REQUEST


// responseCtrl.userResponse = async (req, res) => { 
//     const id = req.params.id;
//     try {
//         const errors = await validationResult(req)
//         if (!errors.isEmpty()) 
//         {
//             return res.status(400).json({errors:errors.array()})
//         }
//         const response=await Response.findOne({bloodRequestId:id})


//         // Check if the response exists
//         if (!response) {
//             return res.status(404).json({ error: 'Response not found' });
//         }

        
//         if(response.responderId.toString()===req.user.id.toString())
//         {
//            res.status(400).json({error:'you already responded'})
//         }
//         response.status=req.body.status;
//         response.responderId=req.user.id;
//         response.responderType=req.user.role;
//         response.bloodRequestId=id;
//         await response.save()
//         res.json(response)
//         }
//         catch(err) 
//         {
//             console.error('Error occurred: userr', err);
//         return res.status(500).json({ error: 'internal server error' });
//         }
// };

module.exports=responseCtrl