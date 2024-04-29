const mongoose=require('mongoose')
const User=require('./user-model')
const {Schema,model}=mongoose

const bloodRequestSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:User
    },
    patientName:String,
    blood:{
        bloodType:String,
        bloodGroup:String
        },
    units:Number,
    date:Date,
    atendeePhNumber:String,
    critical:String,
    donationAddress:
    {
    building:{
        type:String,
        required:true
     },
     locality:{
         type:String,
         required:true
      },
     city:{
         type:String,
         required:true
      },
     state:{
         type:String,
         required:true
      },
     pincode:{
         type:String,
         required:true
     },
     country:{
         type:String,
         required:true
     }
    },
    geoLocation:{
         type:{
             type:String,
             required:true,
             enum:['Point']
         },
         coordinates: {      
             required:true,
             type:[Number]       //geospatial data
         }
        },
    requestType:[String]
},{timestamps:true})



const BloodRequest=model('BloodRequest',bloodRequestSchema)
module.exports=BloodRequest