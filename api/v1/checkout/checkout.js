"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.NODE_ENV != 'production')
    require('dotenv').config();
const stripe = require("stripe");
const paypal = require("paypal-rest-sdk");
const AdvertiserTransactions_1 = require("../../../models/AdvertiserTransactions");
const mongoose_1 = require("mongoose");
const Advertisers_1 = require("../../../models/Advertisers");
const bcrypt = require("bcrypt");
const production = process.env.NODE_ENV === 'production', returnUrl = production ? 'https://adxserver.herokuapp.com/api/v1/checkout/payment-wallet' : 'http://127.0.0.1:5000/api/v1/checkout/payment-wallet', cancelUrl = production ? 'https://adxe.herokuapp.com/client/dashboard/payment-wallet' : 'http://127.0.0.1:4000/client/dashboard/payment-wallet';
/**
* Handle payment checkouts, paypal, mpesa and credit cards
*/
class Checkout {
    /**
     * process checkout using stripes credit card gateway
     * @param req request object
     * @param res response object
     */
    async checkoutCreditCard(req, res) {
        let stripeApiKey = process.env.STRIPE_API_KEY;
        await new stripe(stripeApiKey).customers.createCard(req['client']['client-ssid'], {}).catch(e => e);
    }
    /**
     * process checkout using paypal gateway
     * @param req request object
     */
    async checkoutPayPal(req) {
        let advertiserDetails = await Advertisers_1.default.find({ ssid: req.headers['client-ssid'] }).select('password -_id').exec();
        if (!bcrypt.compareSync(req.body['advertiser-password'], advertiserDetails[0]['password']))
            return { message: 'password-error' };
        paypal.configure({
            mode: 'sandbox',
            client_id: process.env.PAYPAL_CLIENT_ID,
            client_secret: process.env.PAYPAL_CLIENT_SECRET
        });
        let createStatus = await (async () => {
            return new Promise((resolve, reject) => {
                paypal.payment.create({
                    intent: 'sale',
                    payer: {
                        payment_method: 'paypal'
                    },
                    redirect_urls: {
                        return_url: returnUrl + '?client-ssid=' + req['client']['client-ssid'],
                        cancel_url: cancelUrl + '?client-ssid=' + req['client']['client-ssid']
                    },
                    transactions: [{
                            amount: {
                                currency: 'USD',
                                total: req.body['top-up-amount']
                            },
                            description: 'Advertiser account fund top up'
                        }]
                }, async (_err, _response) => {
                    var e_1, _a;
                    if (_err)
                        return reject(_err.response);
                    let url = '';
                    try {
                        for (var _b = __asyncValues(_response.links), _c; _c = await _b.next(), !_c.done;) {
                            const obj = _c.value;
                            if (obj.rel == 'approval_url')
                                url = obj.href;
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    return resolve(url);
                });
            });
        })().catch(err => err);
        let urlChecker = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
        if (urlChecker.test(createStatus) != true)
            return ({ message: 'failed', reason: createStatus });
        return ({ message: 'success', url: createStatus });
    }
    async receivePaypalPayment(req) {
        let paymentResponse = await (async () => {
            return new Promise((resolve, reject) => {
                paypal.payment.execute(req.query['paymentId'], { payer_id: req.query['PayerID'] }, (err, payment) => {
                    if (err)
                        return reject(err);
                    return resolve(payment);
                });
            });
        })().catch(err => err);
        if (paymentResponse.toString().includes('Error'))
            return ({ error: 'server_error' });
        const paymentData = {
            referenceId: paymentResponse['id'],
            paymentState: paymentResponse['state'],
            payerEmail: paymentResponse['payer']['payer_info']['email'],
            payerId: paymentResponse['payer']['payer_info']['payer_id'],
            paidAmount: paymentResponse['transactions'].map(a => a.amount).map(b => b.total).reduce((x, y) => Number(x) + Number(y)),
            payeeEmail: paymentResponse['transactions'].map(a => a.payee).map(b => b.email),
            advertiserReference: req.query['client-ssid']
        };
        // update document record for advertiser req.query['client-ssid']
        let paymentInfo = new AdvertiserTransactions_1.default({
            _id: new mongoose_1.Types.ObjectId(),
            referenceId: paymentData['referenceId'],
            paymentState: paymentData['paymentState'],
            payerEmail: paymentData['payerEmail'],
            payeeEmail: paymentData['payeeEmail'],
            payerId: paymentData['payerId'],
            paidAmount: Number(paymentData['paidAmount']),
            advertiserReference: paymentData['advertiserReference'],
            paymentSource: 'paypal'
        }), paymentStatus = await paymentInfo.save().catch(err => ({ Error: err }));
        if (paymentStatus.toString().includes('Error'))
            return ({ Error: 'internal_server_error' });
        // update advertiser account balance after paypal complete
        return ({ message: 'success' });
    }
    /**
     * process checkout using mpesa gateway for safaricom subscribers
     * @param req request object
     * @param res response object
     */
    async checkoutMpesa(req, res) {
    }
    /**
     * process checkout using airtel money gateway for airtel subscribers
     * @param req request object
     * @param res response object
     */
    async checkoutAirtelMoney(req, res) {
    }
    /**
     * process checkout using skrill gateway for skrill users
     * @param req request object
     * @param res response object
     */
    async checkoutSkrill(req, res) {
    }
    /**
     * process checkout using western union
     * @param req request object
     * @param res response object
     */
    async checkoutWesternUnion(req, res) {
    }
    /**
     * process checkout for equity account holders
     * @param req request object
     * @param res response object
     */
    async checkoutEazzyPay(req, res) {
    }
}
async function checkoutPayPal(req, res) {
    let response = await new Checkout().checkoutPayPal(req);
    if (response.message == 'password-error')
        return res.status(res.statusCode).json({ message: 'password-error' });
    return res.status(res.statusCode).json(response);
}
exports.checkoutPayPal = checkoutPayPal;
async function receivePaypalPayment(req, res) {
    await new Checkout().receivePaypalPayment(req);
    return res.redirect(cancelUrl);
}
exports.receivePaypalPayment = receivePaypalPayment;
