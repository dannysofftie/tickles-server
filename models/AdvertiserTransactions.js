"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
let AdvertiserTransactions = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });
AdvertiserTransactions.virtual('advertiser', {
    ref: 'Advertisers',
    localField: 'advertiserReference',
    foreignField: 'ssid',
    justOne: true
});
exports.default = mongoose_1.model('AdvertiserTransactions', AdvertiserTransactions);
