const mongoose=require('mongoose')
//const User=require('./user-model')
const {Schema,model}=mongoose

const reviewSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User' //by using this approach is efficient and it avoid circular dependency
    },
    bloodBank:{
        type:Schema.Types.ObjectId,
        ref:'BloodBank'
    },
    name:String,
    ratings:Number,
    description:String
},{timestamps:true})

const Review=model('Review',reviewSchema)
module.exports=Review