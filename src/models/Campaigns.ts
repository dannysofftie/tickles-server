import { Schema, model } from 'mongoose'

let Campaigns = new Schema({
    _id: {
        type: Schema.Types.ObjectId
    },
    campaignName: {
        type: String,
        required: true
    }, campaignEstimatedBudget: {
        type: Number,
        required: true
    }, campaignBidPerAd: {
        type: Number,
        required: true
    }, campaignBeginDate: {
        type: Date,
        required: true,
        default: Date.now
    }, campaignEndDate: {
        type: Date,
        required: false
    }, campaignTargetLocations: {
        type: Array,
        required: false,
        default: []
    }, campaignTargetMobile: {
        type: String,
        required: false,
        default: 'off'
    }, campaignTargetTablets: {
        type: String,
        required: false,
        default: 'off'
    }, campaignTargetDesktop: {
        type: String,
        required: false,
        default: 'on'
    }, campaignCategory: {
        type: Schema.Types.ObjectId,
        ref: 'BusinessCategories',
        required: false
    }, campaignBannedDomains: {
        type: Array,
        required: false,
        default: []
    }, advertiserReference: {
        type: String,
        ref: 'Advertiser'
    }
}, { toObject: { virtuals: true } })

Campaigns.virtual('campaignBsCategories', {
    localField: 'businessCategory',
    foreignField: '_id',
    ref: 'BusinessCategories',
    justOne: true
})

Campaigns.virtual('campaignAdvertisements', {
    localField: '_id',
    foreignField: 'adCampaignCategory',
    ref: 'Advertisements',
    justOne: false
})


export default model('Campaigns', Campaigns)
