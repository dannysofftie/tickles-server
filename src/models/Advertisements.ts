import { Schema, model, NativeDate } from 'mongoose'

let Advertisements = new Schema({
    _id: {
        type: Schema.Types.ObjectId
    },
    adName: {
        type: String,
        required: true
    },
    adTitle: {
        type: String,
        required: true
    },
    adCampaignCategory: {
        type: Schema.Types.ObjectId,
        ref: 'Campaigns'
    },
    adDestinationUrl: {
        type: String,
        required: true
    },
    adSelectedType: {
        type: String,
        required: true
    },
    adDisplayImage: {
        type: String,
        required: false,
        default: undefined
    },
    adDescription: {
        type: String,
        required: true
    },
    advertiserReference: {
        type: String,
        ref: 'Advertisers'
    },
    adValidationTime: {
        type: Date,
        require: true
    },
    adVerificationStatus: {
        type: Boolean,
        required: false,
        default: false
    },
    adVerificationMessage: {
        type: String,
        required: false
    }
})

export default model('Advertisements', Advertisements)

/*
{
  adName: '',
  adTitle: '',
  adCampaignCategory: '',
  adDestinationUrl: 'twitter.com',
  adSelectedType: 'image',
  adDisplayImage: 'undefined',
  adDescription: ''
 }
*/