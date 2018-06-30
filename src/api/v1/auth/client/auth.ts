import { Types } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import Advertiser from '../../../../models/Advertiser'
import { sendMail } from '../../utils/send-email'
interface IAdvertiserCredentials {
    captchaValue: string,
    ip: string,
    username: string,
    password: string
}

async function confirmCredentials(username: string, password: string) {
    return 0
}

export async function advertiserLogin(req: Request, res: Response) {
    // email & password
    return await confirmCredentials('', '')
}


export async function advertiserSignUp(req: Request, res: Response) {
    let expectedKeys: Array<string> = ['fullnames', 'emailaddress', 'password', 'businessgrouptarget'],
        incomingKeys: Array<string> = Object.keys(req.body)

    /**
     * ensure incoming body contains all fields as expected
     * @param {Array<string>} d expected keys
     * @param {Array<string>} t incoming body keys
     * @returns {boolean}
     */
    function ensureExpectedBody(d: Array<string>, t: Array<string>): boolean {
        return d.sort().every((a, b, c) => a.trim().toLowerCase() == t.sort()[b].trim().toLowerCase())
    }

    if (!ensureExpectedBody(expectedKeys, incomingKeys))
        return res.status(res.statusCode).json({
            error: 'REQ_BODY_ERROR',
            expectedparams: expectedKeys,
            providedparams: incomingKeys
        })

    let SSID = Buffer.from(req.body['emailaddress'] + ':' + req.body['fullnames']).toString('base64'),
        hashPassword = await bcrypt.hashSync(req.body['password'], 8),
        verificationCode = (Number(new Date()) % 7e9).toString(29).toUpperCase(),
        advertiser = new Advertiser({
            _id: new Types.ObjectId(),
            fullNames: req.body['fullnames'],
            emailAddress: req.body['emailaddress'],
            password: hashPassword,
            ssid: SSID,
            verificationCode: verificationCode,
            businessGroupTarget: req.body['businessgrouptarget']
        })

    let emailCheck = await Advertiser.find({ emailAddress: req.body['emailaddress'] }).exec()

    if (emailCheck.length > 0)
        return res.status(res.statusCode).json({ error: 'EMAIL_EXISTS' })

    // @ts-ignore
    let saveResult = await advertiser.save().then(data => data.emailAddress == req.body['emailaddress']),
        emailStatus = await sendMail(req.body['emailaddress'], `Verify your account using code: ${verificationCode}`)

    return res.status(res.statusCode).json({ signupStatus: saveResult, emailStatus: emailStatus })
}