const nodemailer=require('nodemailer')
const BloodRequest=require('../models/bloodRequest-model')
const mailCtrlr={}
mailCtrlr.confirmation=async(req,res)=>{
    const {donorEmail,donorName,bloodGroup,requestId,donationAddress,donationDate}=req.body
    console.log(donationAddress)
    try{
        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: process.env.EMAIL, 
                pass: process.env.PASSWORD   
            }
        });
        const mailOptions = {
            from: process.env.EMAIL,
            to: `${donorEmail}`,
            subject: 'Blood Donation Confirmation',
            text: `Dear ${donorName},

Thank you for your response and willingness to donate blood. We have received your confirmation, and you are requested to donate blood at the following address:

Donation Address:
${donationAddress?.building},${donationAddress?.locality},${donationAddress?.pincode},${donationAddress?.city},${donationAddress?.state},${donationAddress?.country}

Blood Group: ${bloodGroup}
Request ID: ${requestId}

Please make sure to donate on the scheduled date: ${new Date(donationDate).toLocaleDateString()}.

We appreciate your generous contribution to saving lives!

Best regards,
Blood Bond Team`
        };
        await transporter.sendMail(mailOptions)
        res.status(200).json({ message: 'Confirmation email sent successfully!' });
    }catch(err){
        console.error('Error sending email:', err);
        res.status(500).json({ error: 'Failed to send confirmation email.' });
    }
}
mailCtrlr.shareRequest=async(req,res)=>{
    const {email,requestId}=req.body
    try{
        const request=await BloodRequest.findById(requestId)
        if(!request){
            return res.status(404).json({ error: 'Blood request not found' });
        }
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL, 
                pass: process.env.PASSWORD  
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Blood Request Details',
            text: `Patient Name: ${request.patientName}\nBlood Group: ${request.blood.bloodGroup}\nContact Number: ${request.atendeePhNumber}\nUnits: ${request.units}\nCritical: ${request.critical}\nDonation Address: ${request.donationAddress.building}, ${request.donationAddress.locality}, ${request.donationAddress.city}, ${request.donationAddress.pincode}, ${request.donationAddress.state}, ${request.donationAddress.country}`
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });
    }catch(err){
        console.error('Error sending email:', err);
        res.status(500).json({ error: 'Failed to send email' });
    }
}
module.exports=mailCtrlr