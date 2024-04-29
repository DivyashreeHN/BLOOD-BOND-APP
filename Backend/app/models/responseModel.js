const mongoose=require('mongoose')

const BloodRequest = require('./bloodRequest-model')
const {Schema,model}=mongoose

const responseSchema=new Schema({
    responderType:String,
    responderId:{
        type:Schema.Types.ObjectId
    },
    status:String,
    bloodRequestId:{
        type:Schema.Types.ObjectId,
        ref:BloodRequest
    }
},{timestamps:true})

const Response=model('Response',responseSchema)
module.exports=Response