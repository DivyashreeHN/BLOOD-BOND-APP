const {validationResult}=require('express-validator')
const responseCtrl={}
const BloodRequest=require('../models/bloodRequest-model')
const Response = require('../models/responseModel');
const bloodRequestCltr = require('./blood-request-controller');
const Profile=require('../models/userProfile-model')



//RESPONSE BY ADMIN

responseCtrl.createByAdmin = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const bloodRequests = await BloodRequest.find();
        const updatedResponses = [];

        for (const request of bloodRequests) {
            const existingResponse = await Response.findOne({ bloodRequestId: request._id });

            // If no existing response, create a new one
            if (!existingResponse) {
                const newResponse = new Response({
                    status: "pending",
                    bloodRequestId: request._id,
                });
                await newResponse.save();
                updatedResponses.push(newResponse);
            }
        }

        if (updatedResponses.length === 0) {
            return res.json({ message: "All blood requests already have responses." });
        }

        res.json(updatedResponses);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

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
        // if(response.responderId==req.user.id)
        // {
        //    res.status(400).json({error:'you already responded'})
        // }
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