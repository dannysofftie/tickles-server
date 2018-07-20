"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 *
 *
 */
const mongoose_1 = require("mongoose");
const ClientAdInteraction = new mongoose_1.Schema({
    _id: {
        type: String,
        required: true
    },
    clintIpAddress: {
        type: String,
        required: true,
        alias: 'ip'
    },
    clientDevice: {
        type: String,
        required: true,
        default: 'desktop'
    },
    adInteractionType: {
        type: String,
        alias: 'interactionCategory',
        required: true
    },
    adCategory: {}
});
exports.default = mongoose_1.model('ClientAdInteraction', ClientAdInteraction);
