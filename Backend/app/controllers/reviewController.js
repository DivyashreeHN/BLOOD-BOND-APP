const User =require('../models/user-model')
const BloodBank=require('../models/bloodBankModel')
const Review=require('../models/review-model')
const _=require('lodash')
const {validationResult}=require('express-validator')
const reviewCtrlr={}
reviewCtrlr.create=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const body=req.body
    console.log('body',req.body)
    const id=req.user.id
    const bloodbankId=req.params.bloodbankId
    try{
    const review=new Review(body)
    review.user=id
    review.bloodBank=bloodbankId
    const noOfReviews=await Review.countDocuments({bloodBank:bloodbankId})
    const bloodbank=await BloodBank.findById(bloodbankId)
    const prevRating=bloodbank.ratings
    const newRating =(prevRating * noOfReviews + body.ratings) / (noOfReviews + 1)
    bloodbank.ratings=newRating
    await bloodbank.save()
    await review.save()
    res.status(201).json(review)
    }catch(err){
        console.log(err);
    res.status(500).json({ error: "internal server error" })
    }
}
reviewCtrlr.list=async(req,res)=>{
    const bloodbankId=req.params.bloodbankId
    try{
        const reviews=await Review.find({bloodBank:bloodbankId})
        if (!reviews) {
            return res.status(404).json("no reviews found");
          }
        res.status(201).json(reviews)
    }catch(err){
    console.log(err);
    res.status(500).json({ error: "internal server error" })
    }
}
reviewCtrlr.delete=async(req,res)=>{
    const userId = req.user.id;
  const id = req.params.reviewId;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    res.status(403).json({ error: "you are not authorised for deleting this record" });
  }
  try {
    const review = await Review.findOneAndDelete({ _id: id });
    res.json(review);
  } catch (err) {
    console.log(err);
    res.json({ error: "internal server error" });
  }
}
reviewCtrlr.update=async(req,res)=>{
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const id = req.params.reviewId;
  const body = _.pick(req.body, ["ratings", "description", "photos"]);
  const userId = req.user.id;
  try {
    const review = await Review.findOneAndUpdate({ _id: id,user: req.user.id },
      body,{ new: true }
    );
    res.status(201).json(review);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
}
module.exports=reviewCtrlr