/*
 * 
 * 
 */
import { Schema, model } from 'mongoose'

const ClientAdInteraction = new Schema({
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
    adCategory: {

    }
})


export default model('ClientAdInteraction', ClientAdInteraction)