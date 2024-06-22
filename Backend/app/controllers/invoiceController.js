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
module.exports=invoiceCtrlr