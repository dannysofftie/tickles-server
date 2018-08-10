"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Referrals = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Schema.Types.ObjectId,
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
});
exports.default = mongoose_1.model('Referrals', Referrals);
