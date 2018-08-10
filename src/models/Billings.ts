import { Schema, model } from 'mongoose'
import Advertisers from './Advertisers';
import AdvertiserTransactions from './AdvertiserTransactions';

const Billings = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: true
    }, advertiserReference: {
        type: String,
        required: true
    }, adReference: {
        type: String,
        required: false
    }, impression: {
        type: String,
        enum: ['view', 'click', 'doubleclick'],
        required: true
    }, visitorSessionId: {
        type: String,
        required: true
    }, referencedPublisher: {
        type: String,
        required: true
    }, billAmount: {
        type: Number,
        required: false
    }, billDate: {
        type: Date,
        required: false,
        default: Date.now
    }, billStatus: {
        type: Boolean,
        required: false,
        default: false
    }
})

Billings.pre('save', async function (next) {
    if (this['impression'] == 'view')
        this['billAmount'] = 0.2
    else if (this['impression'] == 'click')
        this['billAmount'] = 1
    else
        this['billAmount'] = 2

    await updateAdvertiser(this['advertiserReference'], this['billAmount'])
    this['billStatus'] = true
    next()
})

async function updateAdvertiser(advertiserReference: string, amount: string) {

    let updateBalance = await Advertisers.findOneAndUpdate({ ssid: advertiserReference }, {
        $inc: { accountBalance: -Number(amount) }
    }).exec()

    return updateBalance['accountBalance']

}

export default model('Billings', Billings)