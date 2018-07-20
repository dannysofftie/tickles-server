"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
* this collection will feature ad data,
* store ad impressions,views, and other related ad data upon delivery to publisher sites and applications
*/
const mongoose_1 = require("mongoose");
const AdActivities = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    adViews: {
        type: Number,
        required: false,
        default: 0
    },
    adClick: {
        type: Number,
        default: 0,
        required: false
    },
    clientIpAddress: {
        type: String,
        required: true
    },
    adViewDuration: {
        type: Date,
        required: false
    },
    clientSessionId: {
        type: String,
        required: true,
    },
    clientLocation: {
        type: String,
        required: true
    },
    adReferenceId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Advertisements',
        required: true
    },
    advertiserReferenceSsid: {
        type: String,
        required: true,
        ref: 'Advertisers'
    }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });
AdActivities.virtual('advertiser', {
    ref: 'Advertisers',
    localField: 'advertiserReferenceSsid',
    foreignField: 'ssid',
    justOne: true
});
exports.default = mongoose_1.model('AdActivities', AdActivities);
