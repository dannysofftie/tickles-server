/*
 * Danny Sofftie <dankim761@gmail.com> July 5th 2018
 * ad verification in conformance to the company's terms and conditions, url varefication,
 * and other utilities 
 */
import { Request, Response, NextFunction } from 'express'
import * as dns from 'dns'
import Advertisements from '../../../models/Advertisements';
import Publisher from '../../../models/Publisher';
import { extractRequestCookies } from '../utils/origin-cookies';

export function validateRequests(req: Request, res: Response, next: NextFunction) {

    if (req.headers['client-ssid'] == undefined) {
        return res.status(500).json({ error: 'unauthorized', info: 'missing credentials' })
    }

    let date = new Date(),
        month = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth(),
        currentDate = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
        hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
        minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
        seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds(),
        requestData = {
            'validation-status': true,
            'client-ssid': req.headers['client-ssid'],
            'validation-time': `${date.getFullYear()}-${month}-${currentDate}T${hours}:${minutes}:${seconds}`,
            'request-path': req.originalUrl,
            'client-ip': req.ip
        }

    req['client'] = requestData

    return next()
}


export async function validateWebsiteUrl(req: Request, res: Response) {

    let addresses: {} | string
    const ip = /^(?:(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(\.(?!$)|$)){4}$/
    if (ip.test(req.body['url']) != false)
        addresses = await (async function () {
            return new Promise(function (resolve, reject) {
                dns.reverse(req.body['url'], function (err, hostnames) {
                    err ? reject(err) : resolve(hostnames)
                })
            })
        })().catch(err => (err))
    else
        addresses = await (async function () {
            return new Promise(function (resolve, reject) {
                dns.lookup(req.body['url'], function (err, address) {
                    err ? reject(err) : resolve(address)
                })
            })
        })().catch(err => (err))
    try {
        if (addresses.toString().indexOf('Error') != -1)
            return res.status(res.statusCode).json({ status: false })
    } catch  {
        return res.status(res.statusCode).json({ status: false })
    }
    return res.status(res.statusCode).json({ status: true })
}

/**
 * Verify publisher before delivering an ad
 */
export async function verifyPublisher(req: Request, res: Response, next: NextFunction) {
    let pubSite = extractRequestCookies(req.headers.cookie, 'original-url'),
        pubData = await Publisher.find({ publisherAppUrl: pubSite }).select('publisherAppUrl').exec()
    console.log(pubSite)
    if (pubData.length > 0)
        return next()
    return res.end()
}

/**
 * This utility will be called automatically after every 2 hours,
 * it runs all unverified ad documents in the database, through a verification
 * definition:
 * - checks destination urls,
 * - compares ads tagged under the same advertiser for similarity,
 * - checks account for allowed minimum vs estimated amount per campaign set by advertiser
 * 
 * ------------------------------------------------------------------------
 * To verify destination url, this utility does a domain resolution of the url provided,
 * and tries to obtain ip address of the host six consequtive times, and compares the returned ip addresses.
 * If ip address was provided instead, this utility does a reverse lookup to obtain domain name,
 * if all checks domain resolution and reverse lookup fails, this utility tries ping requests which on fail,
 * ad is invalidated and marked for deletion. 
 * 
 * ------------------------------------------------------------------------
 * An email is sent to advertiser indicating verification status 
 */
export async function adVerificationUtility(req: Request, res: Response) {
    let allUnverifiedAds = await Advertisements.find({ adVerificationStatus: false }).exec()
    for await (const ad of allUnverifiedAds) {
        // do the logic here
    }
}
