import { Schema, model } from 'mongoose'

const Publishers = new Schema({
    _id: {
        type: Schema.Types.ObjectId
    },
    publisherEmail: {
        type: String,
        required: true
    },
    publisherAppUrl: {
        type: String,
        required: true
    },
    publisherPassword: {
        type: String,
        required: true
    },
    publisherDefaultWallet: {
        type: String,
        required: false
    },
    isAppUrlVerified: {
        type: Boolean,
        required: false,
        default: false
    },
    publisherSsid: {
        type: String,
        required: true
    },
    businessCategory: {
        type: Schema.Types.ObjectId,
        required: false
    }
}, { toObject: { virtuals: true } })

Publishers.virtual('pubbusiness', {
    localField: 'businessCategory',
    foreignField: '_id',
    ref: 'BusinessCategories',
    justOne: true
})
export default model('Publishers', Publishers)