const mongoose=require('mongoose')
//const User=require('./user-model')
const {Schema,model}=mongoose

const userProfileSchema=new Schema({
    user:{
    type:Schema.Types.ObjectId,
    ref:'User'
        },
    firstName:String,
    lastName:String,
    dob:Date,
    gender:String,
    phNo:String,
    blood:{
        bloodType:String,
        bloodGroup:String
    },
    lastBloodDonationDate:Date,
    address:
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
    weight:Number,
    testedPositiveForHiv:String,
    tattoBodyPiercing:String

},{timestamps:true})
const Profile=model("Profile",userProfileSchema)
module.exports=Profile