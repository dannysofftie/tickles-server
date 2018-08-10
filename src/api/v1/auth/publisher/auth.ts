import { Request, Response } from "express";
import Publisher from "../../../../models/Publisher";
import * as bcrypt from 'bcrypt'

export async function publisherLogin() {

}

export async function verifyPaypal(req: Request, res: Response) {
    let verificationPassword = await Publisher.find({ publisherSsid: req.headers['client-ssid'] }).select('').exec()
    if (verificationPassword.length < 1)
        return res.status(res.statusCode).json({ error: 'not-exist' })

    if (!bcrypt.compareSync(req.body['password'], verificationPassword[0]['publisherPassword']))
        return res.status(res.statusCode).json({ error: 'password-error' })

    await Publisher.findOneAndUpdate({ publisherSsid: req.headers['client-ssid'] }, {
        $set: {
            publisherDefaultWallet: 'paypal',
            walletAddress: req.body['emailAddress']
        }
    }, { new: true }).exec()

    return res.status(res.statusCode).json({ message: 'success' })
}