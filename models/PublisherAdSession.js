"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
* this collection will feature ad data,
* store ad impressions,views, and other related ad data upon delivery to publisher sites and applications
*/
const mongoose_1 = require("mongoose");
const PublisherAdSession = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    clientIpAddress: {
        type: String,
        required: true
    },
    visitorSessionId: {
        type: String,
        required: true
    },
    incomingUrl: {
        type: String,
        required: true
    },
    incomingUrlPath: {
        type: String,
        required: true
    },
    clientCookies: {
        type: Array,
        required: false,
        default: []
    },
    clientDevice: {
        type: String,
        required: true
    },
    clientBrowser: {
        type: String,
        required: true
    },
    clientBrowserVersion: {
        type: String,
        required: false
    },
    clientOperatingSystem: {
        type: String,
        required: true
    },
    suggestedAds: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Advertisements',
            required: true,
            default: []
        }],
    sessionDate: {
        type: Date,
        default: Date.now
    }, visitorLocation: {
        country_short: {
            type: String
        },
        country_long: {
            type: String
        },
        region: {
            type: String
        },
        city: {
            type: String
        }
    }
});
exports.default = mongoose_1.model('PublisherAdSession', PublisherAdSession);
