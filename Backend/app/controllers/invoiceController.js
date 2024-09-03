const {validationResult} =require('express-validator')
const Invoice=require('../models/invoiceModel')
const BloodRequest=require('../models/bloodRequest-model')
const BloodBank=require('../models/bloodBankModel')
const invoiceCtrlr={}
invoiceCtrlr.create=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const id=req.params.requestId
    const {lineItems,date}=req.body
    try{
        const responder=await BloodBank.findOne({user:req.user.id})
    if(!responder){
        return res.status(404).json({errors:'responder not found'})
    }

    const newInvoice=await Invoice.findOne({request:id,bloodBank:responder._id})
     if(newInvoice){
        return res.status(401).json({errors:'This request already has an invoice'})
    }

    const bloodRequest=await BloodRequest.findById(id).populate('user')
    if(!bloodRequest){
        return res.status(404).json({ errors: 'Blood request not found' })
    }
    
    const amount=lineItems.reduce((acc,cv)=>{
        acc=acc+Number(cv.price)
        return acc
    },0)
    const invoice=new Invoice({
        bloodBank:responder._id,
        user:bloodRequest.user._id,
        request:id,
        lineItems,
        amount,
        date
    })
    await invoice.save()
    res.status(201).json(invoice)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}
invoiceCtrlr.list=async(req,res)=>{
    try{
        console.log('req',req.params)
        const requestId=req.params.requestId
        const responderId=req.params.responderId
        console.log(requestId)
        console.log(responderId)
        const invoice=await Invoice.find({request:requestId,bloodBank:responderId}).populate('bloodBank').populate('request')
        if(!invoice){
            return res.status(400).json({error:'No invoice found for this response'})
        }
        res.status(201).json(invoice)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}
invoiceCtrlr.delete=async(req,res)=>{
    const requestId=req.params.requestId
    try{
        const invoice=await Invoice.findOneAndDelete({request:requestId})
        if(!invoice){
            return res.status(404).json({msg:'No invoice for this response'})
        }
        res.status(200).json(invoice)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}
module.exports=invoiceCtrlr