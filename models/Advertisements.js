"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
let Advertisements = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Schema.Types.ObjectId
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
        type: mongoose_1.Schema.Types.ObjectId,
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
});
exports.default = mongoose_1.model('Advertisements', Advertisements);
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
