import { Schema, model } from 'mongoose'
const Referrals = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    advertiserReference: {
        type: String,
        required: true
    },
    referralDate: {
        type: Date,
        default: Date.now
    },
    referralLink: {
        type: String,
        required: true
    },
    referrees: [{
        reference: {
            type: String
        },
        status: {
            type: Boolean,
            default: false
        },
        revenue: {
            type: Number,
            default: 0
        }
    }]
})

export default model('Referrals', Referrals)