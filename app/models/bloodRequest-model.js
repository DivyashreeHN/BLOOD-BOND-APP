const mongoose=require('mongoose')
const User=require('./user-model')
const {Schema,model}=mongoose

const bloodRequestSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:User
    },
    patientName:String,
    bloodType:String,
    bloodGroup:String,
    units:Number,
    date:Date,
    atendeePhNumber:String,
    donationAddress:String,
    critical:String,
    geo:[String,String],
    requestType:[String]
},{timestamps:true})
const BloodRequest=model('BloodRequest',bloodRequestSchema)
module.exports=BloodRequest