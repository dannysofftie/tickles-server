"use strict";
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const Jimp = require("jimp");
const PublisherAdSession_1 = require("../../../models/PublisherAdSession");
const origin_cookies_1 = require("../utils/origin-cookies");
const ClientAdInteractions_1 = require("../../../models/ClientAdInteractions");
const mongoose_1 = require("mongoose");
const path = require("path");
/**
 * Uses previously built session visitor's cookies, device size, and incoming request's element size
 * for ad placement. The element size in this case, `width & height` is used to determine the ad to deliver,
 * depending on the uploaded image size. If no image was uploaded, a fallback to default Tickles Ad logo,
 * will be used. Tickles Ad has all image sizes, as sp
import { writeFileSync } from 'fs';ecified in publisher's recommended element/ad sizes
 */
class AdBuilder {
    constructor(req, res) {
        this.request = req;
        this.response = res;
        this.clientHeight = Number(this.request['query']['height']);
        this.clientWidth = Number(this.request['query']['width']);
        this.clientSessionId = origin_cookies_1.extractRequestCookies(this.request.headers.cookie, 'tickles-session');
        this.visitorInstanceId = Buffer.from(this.clientSessionId + '||' + new Date().getTime()).toString('base64');
        this.retrievePubSessionData();
    }
    async retrievePubSessionData() {
        var e_1, _a;
        let visitorSession = await PublisherAdSession_1.default.find({
            $and: [
                {
                    visitorSessionId: { $eq: this.clientSessionId }
                }, {
                    sessionDate: { $gte: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000) }
                }
            ]
        }, { suggestedAds: 1 }).populate('suggestedAds');
        if (visitorSession.length < 1) {
            // serve company ad data
            return this.response.status(200).json({});
        }
        // visitorSession is an array of arrays, flatten into a single array
        let proposedAds = visitorSession.map(doc => doc['suggestedAds']).reduce((a, b) => a.concat(b), []), proposedAdsIds = proposedAds.map(doc => doc['_id']), previoulsyServedAds = await ClientAdInteractions_1.default.aggregate([{
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
            }]);
        if (proposedAds.length < 1) {
            // serve company ad data
            return this.response.status(200).json({});
        }
        // writeFileSync('./campaigns.json', JSON.stringify(proposedAds))
        // serve new ads to visitor
        if (previoulsyServedAds.length < 1) {
            let randomAd = proposedAds[Math.floor(Math.random() * proposedAds.length)];
            return await this.deliverAdToVisitor(randomAd);
        }
        else {
            // fallback for when current visitor has received ad, previoulsy marked for this particular session
            let servedAds = previoulsyServedAds.map(doc => doc['ads']).reduce((a, b) => a.concat(b), []), unservedAds = [];
            try {
                for (var proposedAdsIds_1 = __asyncValues(proposedAdsIds), proposedAdsIds_1_1; proposedAdsIds_1_1 = await proposedAdsIds_1.next(), !proposedAdsIds_1_1.done;) {
                    const adId = proposedAdsIds_1_1.value;
                    // comparing equality of ObjectIDs fails, convert to string first
                    let index = servedAds.findIndex(id => id.toString() === adId.toString());
                    if (index == -1)
                        unservedAds.push(adId);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (proposedAdsIds_1_1 && !proposedAdsIds_1_1.done && (_a = proposedAdsIds_1.return)) await _a.call(proposedAdsIds_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            // prioritize previously unserved ads
            if (unservedAds.length > 0) {
                let adIdToServe = unservedAds[Math.floor(Math.random() * unservedAds.length)], adDataToServe = proposedAds.filter(doc => doc['_id'] == adIdToServe)[0];
                return await this.deliverAdToVisitor(adDataToServe);
            }
            else {
                // fallback when all ads has been served before, 
                // let randomAd: Document = proposedAds[
                //     Math.floor(
                //         Math.random() * proposedAds.length
                //     )
                // ]
                // return await this.deliverAdToVisitor(randomAd)
                return await this.deliverAdsWithPriority(proposedAdsIds, proposedAds);
            }
        }
    }
    /**
     * Depending on delivery status, ads served will be prioritized in the order of
     *  views > clicks > doubleclick
     */
    async deliverAdsWithPriority(adIds, allAdData) {
        // all ads with recorded impressions
        let impressions = await ClientAdInteractions_1.default.aggregate([
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
        ]);
        // more than 2 ads with recorded impressions, eliminate the top two with most views,
        // and select a random ad from the remaining ads
        if (impressions.length > 2) {
            let lessViewedAds = impressions.slice(0, impressions.length - 2), randSelection = lessViewedAds[Math.floor(Math.random() * lessViewedAds.length)], adToDeliver = allAdData.find(doc => doc['_id'].toString() == randSelection['_id'].toString());
            return await this.deliverAdToVisitor(adToDeliver);
        }
        let adWithLessViews = allAdData.find(doc => doc['_id'].toString() == impressions[0]['_id'].toString());
        return await this.deliverAdToVisitor(adWithLessViews);
    }
    /**
     * image resize utility to match the height and width of targeted client display container
     */
    async buildDisplayImage(imageName) {
        return new Promise((resolve) => {
            Jimp.read(path.join(__dirname, '../../../uploads/', imageName)).then(async (image) => {
                let processedImage;
                if (this.clientWidth > this.clientHeight)
                    processedImage = await image.resize(Jimp.AUTO, this.clientHeight);
                else
                    processedImage = await image.resize(this.clientWidth, Jimp.AUTO);
                return resolve(processedImage.getBase64Async(Jimp.MIME_PNG));
            });
        });
    }
    /**
     * Deliver ad to visitor
     */
    async deliverAdToVisitor(adData) {
        const adDelivered = new ClientAdInteractions_1.default({
            _id: new mongoose_1.Types.ObjectId(),
            publisherSessionId: this.clientSessionId,
            visitorInstanceId: this.visitorInstanceId,
            adReference: adData['_id'],
            deliveryStatus: true
        }), visitorId = await adDelivered.save().then(doc => doc['visitorInstanceId']).catch(err => []);
        if (visitorId != []) {
            if (adData['adDisplayImage'] != 'null') {
                adData['adDisplayImage'] = await this.buildDisplayImage(adData['adDisplayImage']);
                return this.response.status(200).json(Object.assign({}, adData['_doc'], { visitorInstanceId: visitorId }));
            }
            return this.response.status(200).json(Object.assign({}, adData['_doc'], { visitorInstanceId: visitorId }));
        }
        // an error when saving session data, 
        // fallback to sending company ads which doesn't necessarily need to track visitor interactions
        return this.response.status(400).end();
    }
}
class RecordAdViews {
    constructor(req, res) {
        this.request = req;
        this.response = res;
        this.impression = this.request['query']['impression'];
        this.visitorSessionId = this.request['query']['visitorSessionId'];
        this.updateViewCount();
    }
    async updateViewCount() {
        await ClientAdInteractions_1.default.findOneAndUpdate({
            visitorInstanceId: this.visitorSessionId
        }, { $inc: { 'interactionType.view': 1 } }, { new: true }).exec();
        return;
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
async function deliverAdToPublisher(req, res) {
    if (typeof req['query']['impression'] != 'undefined')
        await new RecordAdViews(req, res);
    // get cookies from database
    await new AdBuilder(req, res);
}
exports.deliverAdToPublisher = deliverAdToPublisher;
