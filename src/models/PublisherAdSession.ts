/*
* this collection will feature ad data,
* store ad impressions,views, and other related ad data upon delivery to publisher sites and applications
*/
import { Schema, model } from 'mongoose'
const PublisherAdSession = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
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
        type: Schema.Types.ObjectId,
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
})


export default model('PublisherAdSession', PublisherAdSession)
