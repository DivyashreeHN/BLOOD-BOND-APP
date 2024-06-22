const { validationResult } = require('express-validator');
const { pick } = require('lodash');
const Payment = require('../models/paymentModel');
const Invoice = require('../models/invoiceModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const paymentsCltr = {};

paymentsCltr.pay = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const body = pick(req.body, ['invoiceId', 'request', 'bloodBank', 'user', 'amount']);
    try {
        // Create a customer
        const customer = await stripe.customers.create({
            name: "Testing",
            address: {
                line1: 'India',
                postal_code: '517501',
                city: 'Tirupati',
                state: 'AP',
                country: 'US',
            },
        });

        // Create a session object
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [{
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: `Blood Request ${body.requestId}`
                    },
                    unit_amount: body.amount * 100
                },
                quantity: 1
            }],
            mode: "payment",
            success_url: "http://localhost:3000/success",
            cancel_url: 'http://localhost:3000/cancel',
            customer: customer.id
        });

        // Create a payment
        const payment = new Payment({
            invoiceId: body.invoiceId,
            request: body.request,
            bloodBank: body.bloodBank,
            user: body.user,
            amount: Number(body.amount),
            paymentType: "card",
            transactionId: session.id
        });

        await payment.save();
        res.json({ id: session.id, url: session.url });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = paymentsCltr;


paymentsCltr.successUpdate=async(req,res)=>{
    try{
        const id = req.params.id
        const body = pick(req.body,['paymentStatus'])
        const updatedPayment = await Payment.findOneAndUpdate({transactionId:id}, body) 
        res.json(updatedPayment)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

paymentsCltr.failedUpdate=async(req,res)=>{
    try{
        const id = req.params.id
        const body = pick(req.body,['paymentStatus'])
        const updatedPayment = await Payment.findOneAndUpdate({transactionId:id}, body) 
        res.json(updatedPayment)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

module.exports = paymentsCltr