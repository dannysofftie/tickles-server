import { Types } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import Advertiser from '../../../../models/Advertiser'
import { sendMail } from '../../utils/send-email'

export async function advertiserLogin(req: Request, res: Response) {
    let expectedKeys: Array<string> = ['emailaddress', 'password'],
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

    let clientData = await Advertiser.find({ emailAddress: req.body['emailaddress'] }).select('password ssid').exec()
    if (clientData.length < 1)
        return res.status(res.statusCode).json({ error: 'NOT_FOUND' })
    // @ts-ignore
    if (!bcrypt.compareSync(req.body['password'], clientData[0].password))
        return res.status(res.statusCode).json({ error: 'WRONG_PASS' })

    // @ts-ignore
    return res.status(res.statusCode).json({ ssid: clientData[0].ssid })
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

    let emailCheck = await Advertiser.find({ emailAddress: req.body['emailaddress'] }).select('emailaddress').exec()

    if (emailCheck.length > 0)
        return res.status(res.statusCode).json({ error: 'EMAIL_EXISTS' })

    // @ts-ignore
    let saveResult = await advertiser.save().then(data => data.emailAddress == req.body['emailaddress']),
        emailStatus = await sendMail(req.body['emailaddress'], `Verify your account using code: ${verificationCode}`)

    return res.status(res.statusCode).json({ signupStatus: saveResult, emailStatus: emailStatus })
}
