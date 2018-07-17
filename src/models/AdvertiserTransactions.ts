import { Schema, model } from 'mongoose'

let AdvertiserTransactions = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
    },
    referenceId: {
        type: String,
        required: true
    },
    paymentSource: {
        type: String,
        required: true
    },
    paymentState: {
        type: String,
        required: true
    },
    payerEmail: {
        type: String,
        required: false
    },
    payeeEmail: {
        type: String,
        required: false
    },
    payerId: {
        type: String,
        required: true
    },
    paidAmount: {
        type: Number,
        required: true
    },
    advertiserReference: {
        type: String,
        required: true
    },
    topUpDate: {
        type: Date,
        default: Date.now
    }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } })

AdvertiserTransactions.virtual('advertiser', {
    ref: 'Advertisers',
    localField: 'advertiserReference',
    foreignField: 'ssid',
    justOne: true
})

export default model('AdvertiserTransactions', AdvertiserTransactions)