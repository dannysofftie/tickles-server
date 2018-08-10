"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Advertisers_1 = require("./Advertisers");
const Billings = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Schema.Types.ObjectId,
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
});
Billings.pre('save', async function (next) {
    if (this['impression'] == 'view')
        this['billAmount'] = 0.2;
    else if (this['impression'] == 'click')
        this['billAmount'] = 1;
    else
        this['billAmount'] = 2;
    await updateAdvertiser(this['advertiserReference'], this['billAmount']);
    this['billStatus'] = true;
    next();
});
async function updateAdvertiser(advertiserReference, amount) {
    let updateBalance = await Advertisers_1.default.findOneAndUpdate({ ssid: advertiserReference }, {
        $inc: { accountBalance: -Number(amount) }
    }).exec();
    return updateBalance['accountBalance'];
}
exports.default = mongoose_1.model('Billings', Billings);
