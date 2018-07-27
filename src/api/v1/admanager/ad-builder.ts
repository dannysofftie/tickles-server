import { Request, Response } from 'express'
import Advertisements from '../../../models/Advertisements';
import Publisher from '../../../models/Publisher';
import { Document } from 'mongoose';
import BusinessCategories from '../../../models/BusinessCategories';
import Advertisers from '../../../models/Advertisers';
import Campaigns from '../../../models/Campaigns';
import { writeFileSync } from 'fs';

class AdGenerator {
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
        let adData = await this.retrieveRawAdData()
        if (this.device.trim().toLowerCase() == 'desktop')
            this.generateDesktopAd(adData)
        else if (this.device.trim().toLowerCase() == 'mobile')
            this.generateMobileAd(adData)
        else this.generateSubStandardAd(adData)

    }

    private async generateDesktopAd(data: Array<string> | {}) {
        // build desktop ad and respond with a fully scaled desktop advertisement

        this.response.status(200).json(data)
    }

    private async generateMobileAd(data: Array<string> | {}) {
        this.response.status(200).json(data)
    }

    // fallback for unrecognized devices
    private async generateSubStandardAd(data: Array<string> | {}) {
        this.response.status(200).json(data)
    }

    private async retrieveRawAdData() {
        let publisher = await Publisher.find({ publisherAppUrl: this.request['client-session']['site-visited'] }).select('-_id ssid').exec()
        let campaigns: Array<Document>
        if (publisher[0]['id'] == null)
            campaigns = await Advertisers.find().select('_id ssid').populate({
                path: 'advertiserCampaigns',
                model: 'Campaigns',
                select: '-campaignName',
                populate: {
                    path: 'campaignAdvertisements',
                    model: 'Advertisements'
                }
            }).exec()
        else
            campaigns = await Advertisers.find({ businessGroupTarget: publisher[0]['businessCategory'] }).select('_id ssid').populate({
                path: 'advertiserCampaigns',
                model: 'Campaigns',
                select: '-campaignName',
                populate: {
                    path: 'campaignAdvertisements',
                    model: 'Advertisements'
                }
            }).exec()

        // writeFileSync('./campaigns.json', JSON.stringify(campaigns))
        // get all campaigns by these advertisers

        // define filtering criteria, based on campaign scheduled dates, adVerificationStatus, campaign bid amount,
        // publisher preffered bid amount and related filters, always return one instance of a particular campaign
        // check targeted location for a particular campaign, and serve when incoming request location matches
        // with priority, else fallback to a random selection, based on bid amount, whether the ad has been served 
        // the day of this request. Previously unserved ads are prioritized for selection.


        return campaigns[0]['advertiserCampaigns'][0]['campaignAdvertisements'][0]
    }
}

export async function adServicePoint(req: Request, res: Response) {
    await new AdGenerator(req, res)
}