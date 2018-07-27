"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Publisher_1 = require("../../../models/Publisher");
const Advertisers_1 = require("../../../models/Advertisers");
class AdGenerator {
    constructor(req, res) {
        this.device = req['client-session']['client-device'];
        this.request = req;
        this.response = res;
        this.determineAdClient();
    }
    async determineAdClient() {
        let adData = await this.retrieveRawAdData();
        if (this.device.trim().toLowerCase() == 'desktop')
            this.generateDesktopAd(adData);
        else if (this.device.trim().toLowerCase() == 'mobile')
            this.generateMobileAd(adData);
        else
            this.generateSubStandardAd(adData);
    }
    async generateDesktopAd(data) {
        // build desktop ad and respond with a fully scaled desktop advertisement
        this.response.status(200).json(data);
    }
    async generateMobileAd(data) {
        this.response.status(200).json(data);
    }
    // fallback for unrecognized devices
    async generateSubStandardAd(data) {
        this.response.status(200).json(data);
    }
    async retrieveRawAdData() {
        let publisher = await Publisher_1.default.find({ publisherAppUrl: this.request['client-session']['site-visited'] }).select('-_id ssid').exec();
        let campaigns;
        if (publisher[0]['id'] == null)
            campaigns = await Advertisers_1.default.find().select('_id ssid').populate({
                path: 'advertiserCampaigns',
                model: 'Campaigns',
                select: '-campaignName',
                populate: {
                    path: 'campaignAdvertisements',
                    model: 'Advertisements'
                }
            }).exec();
        else
            campaigns = await Advertisers_1.default.find({ businessGroupTarget: publisher[0]['businessCategory'] }).select('_id ssid').populate({
                path: 'advertiserCampaigns',
                model: 'Campaigns',
                select: '-campaignName',
                populate: {
                    path: 'campaignAdvertisements',
                    model: 'Advertisements'
                }
            }).exec();
        // writeFileSync('./campaigns.json', JSON.stringify(campaigns))
        // get all campaigns by these advertisers
        // define filtering criteria, based on campaign scheduled dates, adVerificationStatus, campaign bid amount,
        // publisher preffered bid amount and related filters, always return one instance of a particular campaign
        // check targeted location for a particular campaign, and serve when incoming request location matches
        // with priority, else fallback to a random selection, based on bid amount, whether the ad has been served 
        // the day of this request. Previously unserved ads are prioritized for selection.
        return campaigns[0]['advertiserCampaigns'][0]['campaignAdvertisements'][0];
    }
}
async function adServicePoint(req, res) {
    await new AdGenerator(req, res);
}
exports.adServicePoint = adServicePoint;
