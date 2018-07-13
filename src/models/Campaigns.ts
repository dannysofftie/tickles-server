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
})

export default model('Campaigns', Campaigns)

/*
{ campaignName: 'Advertisements',
  campaignEstimatedBudget: '20',
  campaignBidPerAd: '2',
  campaignBeginDate: '07/04/2018',
  campaignEndDate: '07/26/2018',
  campaignTargetLocations: '1',
  campaignTargetMobile: 'on',
  campaignTargetTablets: 'on',
  campaignTargetDesktop: 'on',
  campaignCategory: '5b39d9e9f4c01a44adb4de3c',
  campaignBannedDomains: 'banned.net' } 
*/