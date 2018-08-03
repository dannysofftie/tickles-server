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
import Publisher from '../../../models/Publisher'
import { Document } from 'mongoose'
import Advertisers from '../../../models/Advertisers'
import { writeFileSync } from 'fs';

class AdDataSession {
    private device: string
    private request: Request
    private response: Response

    constructor(req: Request, res: Response) {
        this.device = req['client-session']['client-device']
        this.request = req
        this.response = res
        this.determineAdClient()
    }

    private async determineAdClient() {
        let adsIdsToServe = await this.retrieveRawAdData()
        if (adsIdsToServe.length < 1) {
            // serve company ad, with
            // company data,
            // this behaviour is a fallback when no ads meet defined criteria
            // ad data will be provided from company's own data
        }
        switch (this.device.trim().toLowerCase()) {
            case 'desktop':
                this.generateDesktopAd(adsIdsToServe)
                break
            case 'mobile':
                this.generateMobileAd(adsIdsToServe)
                break
            default:
                this.generateSubStandardAd(adsIdsToServe)
                break
        }

        // writeFileSync('./campaigns.json', JSON.stringify(adsIdsToServe))
    }

    /**
     * desktop devices, large screen monitors
     * @param data - specifications:      
     *     -  raw data with ads, as found using request details, including device size, ip address
     *     -  incoming request's publisher business category group and other specification
     * @returns {boolean} - build status
     */
    private async generateDesktopAd(data: Array<string> | {}) {
        // build desktop ad and respond with build status
        // use 'data' passed to complete session, which will be used during subsequent requests
        // for ad data, to be served to the client
        this.response.status(200).json({ status: true })
    }

    /**
     * smartphone devices ad generator
     * @param data - specifications:        
     *     -  raw data with ads, as found using request details, including device size, ip address
     *     -  incoming request's publisher business category group and other specification
     * @returns {boolean} - build status   
     */
    private async generateMobileAd(data: Array<string> | {}) {
        // build desktop ad and respond with build status
        // use 'data' passed to complete session, which will be used during subsequent requests
        // for ad data, to be served to the client
        this.response.status(200).json({ status: true })
    }

    /**
     * fallback for unrecognized devices
     * @param data - specifications:        
     *     -  raw data with ads, as found using request details, including device size, ip address
     *     -  incoming request's publisher business category group and other specification
     * @returns {boolean} - build status
     *         
     */
    private async generateSubStandardAd(data: Array<string> | {}) {
        // use 'data' passed to complete session, which will be used during subsequent requests
        // for ad data, to be served to the client
        this.response.status(200).json({ status: true })
    }

    private async retrieveRawAdData() {
        let publisher = await Publisher.find({ publisherAppUrl: this.request['client-session']['site-visited'] }).select('-_id ssid').exec()
        let campaigns: Array<Document>

        // get all campaigns scheduled in the range of current date of request, 
        // filter out campaigns where domain of the incoming request is banned by the advertiser
        if (publisher.length < 1 || publisher[0]['id'] == null)
            campaigns = await Advertisers.find().select('_id ssid joinedAs').populate({
                path: 'advertiserCampaigns',
                model: 'Campaigns',
                match: {
                    $and: [{
                        campaignBeginDate: { $lte: Date() }
                    }, {
                        campaignEndDate: { $gte: Date() }
                    }, {
                        campaignBannedDomains: { $ne: this.request['client-session']['site-visited'] }
                    }]
                },
                populate: {
                    path: 'campaignAdvertisements',
                    model: 'Advertisements',
                    match: {
                        adVerificationStatus: { $eq: true }
                    }
                }
            }).exec()
        else
            campaigns = await Advertisers.find({ businessGroupTarget: publisher[0]['businessCategory'] }).select('_id ssid joinedAs').populate({
                path: 'advertiserCampaigns',
                model: 'Campaigns',
                match: {
                    $and: [{
                        campaignBeginDate: { $lte: Date() }
                    }, {
                        campaignEndDate: { $gte: Date() }
                    }, {
                        campaignBannedDomains: { $ne: this.request['client-session']['site-visited'] }
                    }]
                },
                populate: {
                    path: 'campaignAdvertisements',
                    model: 'Advertisements',
                    match: {
                        adVerificationStatus: { $eq: true }
                    }
                }
            }).exec()

        // exit after no ads have been found that match defined criteria
        if (campaigns[0]['advertiserCampaigns'].length < 1) {
            return []
        }

        // filter business owners from affiliates
        let businessOwnersCampaigns: Array<Document> = [],
            affiliatesCampaigns: Array<Document> = []

        for await (const campaign of campaigns) {
            if (campaign['joinedAs'] == 'owner')
                businessOwnersCampaigns.push(campaign)
            else
                affiliatesCampaigns.push(campaign)
        }

        // prioritize business owners when a match is found
        if (businessOwnersCampaigns.length > 0)
            return await filterUnservedAds(businessOwnersCampaigns)
        // fallback when business owners' ads has been served before
        else
            return await filterUnservedAds(affiliatesCampaigns)

        async function filterUnservedAds(mixedAds: Array<Document>) {
            let allAdCampaigns: Array<Array<Document>> = mixedAds.map(doc => doc['advertiserCampaigns']),
                allAds: Array<Array<Document>> = [],
                allFilteredAds: Array<Document> = []

            if (allAdCampaigns.length < 1 || allAdCampaigns[0] == null) {
                return []
            }

            for await (const doc of allAdCampaigns) {
                doc.map(value => allAds.push(value['campaignAdvertisements']))
            }
            for await (const doc of allAds) {
                doc.map(value => allFilteredAds.push(value))
            }
            try {
                return allFilteredAds.map(ad => ad['_id'])
            } catch{
                return []
            }
        }

        // define filtering criteria, based on campaign scheduled dates, adVerificationStatus, campaign bid amount,
        // publisher preffered bid amount and related filters, always return one instance of a particular campaign
        // check targeted location for a particular campaign, and serve when incoming request location matches
        // with priority, else fallback to a heuristic selection, based on bid amount, whether the ad has been served 
        // the day of this request. Previously unserved ads are prioritized for selection.
    }
}

/**
 * 
 * Builds possible ads from estimated device size, and updates current visitor's session
 * @param {Request} req request object
 * @param {Response} res response object
 */
export async function estimatedDeviceSizeAdsBuilder(req: Request, res: Response) {
    await new AdDataSession(req, res)
}