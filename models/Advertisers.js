"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
let Advertiser = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Schema.Types.ObjectId
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
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { toObject: { virtuals: true } });
Advertiser.virtual('advertiserCampaigns', {
    localField: 'ssid',
    foreignField: 'advertiserReference',
    ref: 'Campaigns',
    justOne: false
});
exports.default = mongoose_1.model('Advertisers', Advertiser);
