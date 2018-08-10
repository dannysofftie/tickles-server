/*

MIT License

Copyright (c) 2018 Danny Sofftie

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

import { Request, Response } from 'express'
import Jimp = require('jimp')
import PublisherAdSession from '../../../models/PublisherAdSession';
import { extractRequestCookies } from '../utils/origin-cookies';
import ClientAdInteractions from '../../../models/ClientAdInteractions';
import { Types } from 'mongoose';
import * as path from 'path';
import { Document } from 'mongoose'
import Billings from '../../../models/Billings';

/**
 * Uses previously built session visitor's cookies, device size, and incoming request's element size
 * for ad placement. The element size in this case, `width & height` is used to determine the ad to deliver,
 * depending on the uploaded image size. If no image was uploaded, a fallback to default Tickles Ad logo,
 * will be used. Tickles Ad has all image sizes, as sp
import { writeFileSync } from 'fs';ecified in publisher's recommended element/ad sizes
 */
class AdBuilder {
    private request: Request
    private response: Response
    private clientHeight: number
    private clientWidth: number
    private clientSessionId: string
    private visitorInstanceId: string

    constructor(req: Request, res: Response) {
        this.request = req
        this.response = res
        this.clientHeight = Number(this.request['query']['height'])
        this.clientWidth = Number(this.request['query']['width'])
        this.clientSessionId = extractRequestCookies(this.request.headers.cookie, 'tickles-session')
        this.visitorInstanceId = Buffer.from(this.clientSessionId + '||' + new Date().getTime()).toString('base64')
        this.retrievePubSessionData()
    }

    private async retrievePubSessionData() {
        let visitorSession = await PublisherAdSession.find({
            $and: [
                {
                    visitorSessionId: { $eq: this.clientSessionId }
                }, {
                    sessionDate: { $gte: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000) }
                }]
        }, { suggestedAds: 1 }).populate('suggestedAds')

        if (visitorSession.length < 1) {
            // serve company ad data
            return this.response.status(200).json({})
        }

        // visitorSession is an array of arrays, flatten into a single array
        let proposedAds: Array<Document> = visitorSession.map(doc => doc['suggestedAds']).reduce((a, b) => a.concat(b), []),
            proposedAdsIds: Array<string> = proposedAds.map(doc => doc['_id']),
            previoulsyServedAds: Array<Document> = await ClientAdInteractions.aggregate([{
                $match: {
                    $and: [
                        {
                            publisherSessionId: { $eq: this.clientSessionId },
                        },
                        {
                            deliveryDate: { $gte: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000) }
                        }
                    ]
                }
            }, {
                $group: {
                    _id: '$publisherSessionId',
                    ads: { $push: '$adReference' }
                }
            }])

        if (proposedAds.length < 1) {
            // serve company ad data
            return this.response.status(200).json({})
        }

        // writeFileSync('./campaigns.json', JSON.stringify(proposedAds))
        // serve new ads to visitor
        if (previoulsyServedAds.length < 1) {
            let randomAd: Document = proposedAds[
                Math.floor(
                    Math.random() * proposedAds.length
                )
            ]
            return await this.deliverAdToVisitor(randomAd)
        } else {
            // fallback for when current visitor has received ad, previoulsy marked for this particular session
            let servedAds: Array<string> = previoulsyServedAds.map(doc => doc['ads']).reduce((a, b) => a.concat(b), []),
                unservedAds: Array<string> = []

            for await (const adId of proposedAdsIds) {
                // comparing equality of ObjectIDs fails, convert to string first
                let index = servedAds.findIndex(id => id.toString() === adId.toString())
                if (index == -1) unservedAds.push(adId)
            }

            // prioritize previously unserved ads
            if (unservedAds.length > 0) {
                let adIdToServe = unservedAds[
                    Math.floor(
                        Math.random() * unservedAds.length
                    )
                ], adDataToServe = proposedAds.filter(doc => doc['_id'] == adIdToServe)[0]

                return await this.deliverAdToVisitor(adDataToServe)
            } else {
                // fallback when all ads has been served before, 
                // let randomAd: Document = proposedAds[
                //     Math.floor(
                //         Math.random() * proposedAds.length
                //     )
                // ]
                // return await this.deliverAdToVisitor(randomAd)
                return await this.deliverAdsWithPriority(proposedAdsIds, proposedAds)
            }
        }
    }

    /**
     * Depending on delivery status, ads served will be prioritized in the order of
     *  views > clicks > doubleclick
     */
    private async deliverAdsWithPriority(adIds: Array<string>, allAdData: Array<Document>) {
        // all ads with recorded impressions
        let impressions = await ClientAdInteractions.aggregate([
            {
                $match: { adReference: { $in: adIds } }
            }, {
                $group: {
                    _id: "$adReference",
                    impressions: { $sum: 1 },
                    views: { $sum: "$interactionType.view" },
                    clicks: { $sum: "$interactionType.click" },
                    doubleClick: { $sum: "$interactionType.doubleClick" }
                }
            }, {
                $sort: { views: 1 }
            }
        ])

        // more than 2 ads with recorded impressions, eliminate the top two with most views,
        // and select a random ad from the remaining ads
        if (impressions.length > 2) {
            let lessViewedAds = impressions.slice(0, impressions.length - 2),
                randSelection = lessViewedAds[Math.floor(Math.random() * lessViewedAds.length)],
                adToDeliver = allAdData.find(doc => doc['_id'].toString() == randSelection['_id'].toString())
            return await this.deliverAdToVisitor(adToDeliver)
        }

        let adWithLessViews = allAdData.find(doc => doc['_id'].toString() == impressions[0]['_id'].toString())

        return await this.deliverAdToVisitor(adWithLessViews)
    }
    /**
     * image resize utility to match the height and width of targeted client display container
     */
    private async buildDisplayImage(imageName: string) {
        return new Promise((resolve) => {
            Jimp.read(path.join(__dirname, '../../../uploads/', imageName)).then(async image => {
                let processedImage: Jimp

                if (this.clientWidth > this.clientHeight)
                    processedImage = await image.resize(Jimp.AUTO, this.clientHeight)
                else
                    processedImage = await image.resize(this.clientWidth, Jimp.AUTO)

                return resolve(processedImage.getBase64Async(Jimp.MIME_PNG))
            })
        })
    }

    /**
     * Deliver ad to visitor
     */
    private async deliverAdToVisitor(adData: Document) {
        const adDelivered = new ClientAdInteractions({
            _id: new Types.ObjectId(),
            publisherSessionId: this.clientSessionId,
            visitorInstanceId: this.visitorInstanceId,
            adReference: adData['_id'],
            deliveryStatus: true
        }),
            visitorId = await adDelivered.save().then(doc => doc['visitorInstanceId']).catch(err => [])

        if (visitorId != []) {
            if (adData['adDisplayImage'] != 'null') {
                adData['adDisplayImage'] = await this.buildDisplayImage(adData['adDisplayImage'])
                return this.response.status(200).json({ ...adData['_doc'], visitorInstanceId: visitorId })
            }
            return this.response.status(200).json({ ...adData['_doc'], visitorInstanceId: visitorId })
        }
        // an error when saving session data, 
        // fallback to sending company ads which doesn't necessarily need to track visitor interactions
        return this.response.status(400).end()
    }
}


class RecordAdViews {

    private request: Request
    private response: Response
    private impression: string
    private visitorSessionId: string
    private advertiserReference: string
    private adReference: string

    constructor(req: Request, res: Response) {
        this.request = req
        this.response = res
        this.impression = this.request['query']['impression']
        this.visitorSessionId = this.request['query']['visitorSessionId']
        this.advertiserReference = this.request['query']['advertiserReference']
        this.adReference = this.request['query']['adReference']
        this.updateViewCount()
    }

    private async updateViewCount() {
        // record view
        await ClientAdInteractions.findOneAndUpdate({
            visitorInstanceId: this.visitorSessionId
        }, { $inc: { 'interactionType.view': 1 } }, { new: true }).exec()
        // record bill
        await new Billings({
            _id: new Types.ObjectId(),
            advertiserReference: this.advertiserReference,
            adReference: this.adReference,
            impression: 'view',
            visitorSessionId: this.visitorSessionId,
            referencedPublisher: extractRequestCookies(this.request['headers']['cookie'], 'original-url')
        }).save()

        return
    }
}

/**
 * An instance of 
 *      - class AdBuilder{}
 * Uses previously built session visitor's cookies, device size, and incoming request's element size
 * for ad placement. The element size in this case, `width & height` is used to determine the ad to deliver,
 * depending on the uploaded image size. If no image was uploaded, a fallback to default Tickles Ad logo,
 * will be used. Tickles Ad has all image sizes, as specified in publisher's recommended element/ad sizes
 * 
 *  - Responds with ad data for delivery
 */
export async function deliverAdToPublisher(req: Request, res: Response) {
    if (typeof req['query']['impression'] != 'undefined')
        await new RecordAdViews(req, res)
    // get cookies from database
    await new AdBuilder(req, res)
}