"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Publisher_1 = require("../../../models/Publisher");
const BusinessCategories_1 = require("../../../models/BusinessCategories");
class AdGenerator {
    constructor(req, res) {
        this.device = req['client-session']['client-device'];
        this.request = req;
        this.response = res;
        this.determineAdClient();
    }
    determineAdClient() {
        if (this.device.trim().toLowerCase() == 'desktop')
            this.generateDesktopAd();
        else if (this.device.trim().toLowerCase() == 'mobile')
            this.generateMobileAd();
        else
            this.generateSubStandardAd();
    }
    async generateDesktopAd() {
        let adData = await this.retrieveAdData();
        this.response.end();
    }
    async generateMobileAd() {
    }
    async generateSubStandardAd() {
    }
    async retrieveAdData() {
        let publisher = await Publisher_1.default.find({ publisherAppUrl: this.request['client-session']['site-visited'] }).select('-_id nonexstingfield').exec();
        let ads;
        if (publisher[0]['id'] == null)
            // select random advertisements
            ads = await BusinessCategories_1.default.find().populate('adCampaignCategory').exec();
        console.log(ads);
        return publisher;
    }
}
async function adServicePoint(req, res) {
    await new AdGenerator(req, res);
}
exports.adServicePoint = adServicePoint;
