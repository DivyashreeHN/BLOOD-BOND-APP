const { Schema, model } = require('mongoose');

const paymentsSchema = new Schema({
    invoiceId: {
        type: Schema.Types.ObjectId,
        ref: "Invoice",
        required: true
    },
    request: {
        type: Schema.Types.ObjectId,
        ref: 'BloodRequest',
        required: true
    },
    bloodBank: {
        type: Schema.Types.ObjectId,
        ref: 'BloodBank',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentType: {
        type: String,
        required: true
    },
    transactionId: {
        type: String,
        default: null
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'successful', 'failed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

const Payment = model('Payment', paymentsSchema);

module.exports = Payment;
