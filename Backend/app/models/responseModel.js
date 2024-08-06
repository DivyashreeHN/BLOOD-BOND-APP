const mongoose=require('mongoose')

const BloodRequest = require('../models/bloodRequest-model')
const {Schema,model}=mongoose

const responseSchema=new Schema({
    responderType:String,
    responderId:{
        type:Schema.Types.ObjectId,
         required: true, 
        //  refPath: 'responderType'
    },
    email:String,
    status:String,
    bloodRequestId:{
        type:Schema.Types.ObjectId,
        ref:BloodRequest
    }
},{timestamps:true})

const Response=model('Response',responseSchema)
module.exports=Response