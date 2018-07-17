import { Request, Response } from 'express'
import * as stripe from 'stripe'
import * as paypal from 'paypal-rest-sdk'
import { promisify } from 'util';
import AdvertiserTransactions from '../../../models/AdvertiserTransactions';
import { Types } from 'mongoose';

const production = process.env.NODE_ENV === 'production',
    returnUrl = production ? 'https://adxserver.herokuapp.com/api/v1/checkout/payment-wallet' : 'http://127.0.0.1:5000/api/v1/checkout/payment-wallet',
    cancelUrl = production ? 'https://adxe.herokuapp.com/client/dashboard/payment-wallet' : 'http://127.0.0.1:4000/client/dashboard/payment-wallet'
/**
* Handle payment checkouts, paypal, mpesa and credit cards
*/
class Checkout {
    /**
     * process checkout using stripes credit card gateway
     * @param req request object
     * @param res response object
     */
    public async checkoutCreditCard(req: Request, res: Response) {
        let stripeApiKey = process.env.STRIPE_API_KEY
        await new stripe(stripeApiKey).customers.createCard(req['client']['client-ssid'], {}).catch(e => e)
    }

    /**
     * process checkout using paypal gateway
     * @param req request object
     */
    public async checkoutPayPal(req: Request) {
        paypal.configure({
            mode: 'sandbox',
            client_id: 'AfMhLAlCW3r0T0lakRSSqIq6NF_KlhqCktwU2FGkn8F9AapoWpDI5llCiS-oIxKW33YjLYahCtp6bzpJ',
            client_secret: 'EAijNzwin9wOMii_ZAZkEs3uJ8QP-s62E5lsMjoO073PgQMh7OJ1pkXVHD0cJZI9DCrR-qe9Tp1FZwzT'
        })

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
                        description: 'Advertiser account fund top-up'
                    }]
                }, async (_err, _response) => {
                    if (_err)
                        return reject(_err.response)
                    let url = ''
                    for await (const obj of _response.links) {
                        if (obj.rel == 'approval_url')
                            url = obj.href
                    }
                    return resolve(url)
                })
            })
        })().catch(err => err)

        let urlChecker: RegExp = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
        if (urlChecker.test(createStatus) != true)
            return ({ message: 'failed', reason: createStatus })
        return ({ message: 'success', url: createStatus })
    }

    public async receivePaypalPayment(req: Request) {
        let paymentResponse = await (async () => {
            return new Promise((resolve, reject) => {
                paypal.payment.execute(req.query['paymentId'], { payer_id: req.query['PayerID'] }, (err, payment) => {
                    if (err)
                        return reject(err)
                    return resolve(payment)
                })
            })
        })().catch(err => err)

        if (paymentResponse.toString().includes('Error'))
            return ({ error: 'server_error' })

        const paymentData = {
            referenceId: paymentResponse['id'],
            paymentState: paymentResponse['state'],
            payerEmail: paymentResponse['payer']['payer_info']['email'],
            payerId: paymentResponse['payer']['payer_info']['payer_id'],
            paidAmount: paymentResponse['transactions'].map(a => a.amount).map(b => b.total).reduce((x, y) => Number(x) + Number(y)),
            payeeEmail: paymentResponse['transactions'].map(a => a.payee).map(b => b.email),
            advertiserReference: req.query['client-ssid']
        }

        // update document record for advertiser req.query['client-ssid']
        let paymentInfo = new AdvertiserTransactions({
            _id: new Types.ObjectId(),
            referenceId: paymentData['referenceId'],
            paymentState: paymentData['paymentState'],
            payerEmail: paymentData['payerEmail'],
            payeeEmail: paymentData['payeeEmail'],
            payerId: paymentData['payerId'],
            paidAmount: Number(paymentData['paidAmount']),
            advertiserReference: paymentData['advertiserReference'],
            paymentSource: 'paypal'
        }), paymentStatus = await paymentInfo.save().catch(err => ({ Error: err }))

        console.log(paymentResponse, paymentInfo)
        if (paymentStatus.toString().includes('Error'))
            return ({ Error: 'internal_server_error' })
        return ({ message: 'success' })
    }
    /**
     * process checkout using mpesa gateway for safaricom subscribers
     * @param req request object
     * @param res response object
     */
    public async checkoutMpesa(req: Request, res: Response) {

    }

    /**
     * process checkout using airtel money gateway for airtel subscribers
     * @param req request object
     * @param res response object
     */
    public async checkoutAirtelMoney(req: Request, res: Response) {

    }

    /**
     * process checkout using skrill gateway for skrill users
     * @param req request object
     * @param res response object
     */
    public async checkoutSkrill(req: Request, res: Response) {

    }

    /**
     * process checkout using western union
     * @param req request object
     * @param res response object
     */
    public async checkoutWesternUnion(req: Request, res: Response) {

    }

    /**
     * process checkout for equity account holders
     * @param req request object
     * @param res response object
     */
    public async checkoutEazzyPay(req: Request, res: Response) {

    }
}

export async function checkoutPayPal(req: Request, res: Response) {
    let response = await new Checkout().checkoutPayPal(req)
    res.status(res.statusCode).json(response)
}

export async function receivePaypalPayment(req: Request, res: Response) {
    let response = await new Checkout().receivePaypalPayment(req)
    console.dir(response)
    return res.redirect(cancelUrl)
}
