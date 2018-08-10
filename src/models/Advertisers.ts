import { Schema, model } from 'mongoose'

let Advertiser = new Schema({
    _id: {
        type: Schema.Types.ObjectId
    }, fullNames: {
        type: String,
        required: true
    }, emailAddress: {
        type: String,
        required: true,
        unique: true
    }, password: {
        type: String,
        required: true
    }, ssid: {
        type: String,
        required: true
    }, verificationCode: {
        type: String,
        required: true
    }, verified: {
        type: Number,
        default: 0
    }, businessGroupTarget: {
        type: Schema.Types.ObjectId,
        ref: 'BusinessCategories'
    },
    referred: {
        value: {
            type: Boolean,
            default: false
        },
        referrerId: {
            type: String,
            required: false
        }
    }, accountBalance: {
        type: Number,
        required: false,
        default: 0
    }
}, { toObject: { virtuals: true } })

Advertiser.virtual('advertiserCampaigns', {
    localField: 'ssid',
    foreignField: 'advertiserReference',
    ref: 'Campaigns',
    justOne: false
})

export default model('Advertisers', Advertiser)