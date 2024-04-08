const mongoose=require('mongoose')
const User=require('./user-model')
const {Schema,model}=mongoose

const userProfileSchema=new Schema({
    user:{
    type:Schema.Types.ObjectId,
    ref:User
        },
    firstName:String,
    LastName:String,
    dob:Date,
    gender:String,
    phNo:String,
    bloodGroup:String,
    lastBloodDonationDate:Date,
    address:String,
    geo:[String,String],
    weight:Number,
    testedPositiveForHiv:String,
    tattoBodyPiercing:String

},{timestamps:true})
const Profile=model("Profile",userProfileSchema)
module.exports=Profile