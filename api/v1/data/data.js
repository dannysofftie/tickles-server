"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BusinessCategories_1 = require("../../../models/BusinessCategories");
const Campaigns_1 = require("../../../models/Campaigns");
const Advertisers_1 = require("../../../models/Advertisers");
const Advertisements_1 = require("../../../models/Advertisements");
const AdvertiserTransactions_1 = require("../../../models/AdvertiserTransactions");
async function getBusinessCategories(req, res) {
    await BusinessCategories_1.default.insertMany([{
            _id: new mongoose_1.Types.ObjectId(),
            businessName: 'Fashion & Design'
        }, {
            _id: new mongoose_1.Types.ObjectId(),
            businessName: 'Clothing, accessories, and shoes'
        }, {
            _id: new mongoose_1.Types.ObjectId(),
            businessName: 'Computers, accessories, and services'
        }, {
            _id: new mongoose_1.Types.ObjectId(),
            businessName: 'Entertainment and media'
        }, {
            _id: new mongoose_1.Types.ObjectId(),
            businessName: 'Health and personal care'
        }, {
            _id: new mongoose_1.Types.ObjectId(),
            businessName: 'Vehicle service and accessories'
        }, {
            _id: new mongoose_1.Types.ObjectId(),
            businessName: 'Gifts and flowers'
        }, {
            _id: new mongoose_1.Types.ObjectId(),
            businessName: 'Food retail and service'
        }, {
            _id: new mongoose_1.Types.ObjectId(),
            businessName: 'Services - other'
        }]).catch(e => e);
    let docs = await BusinessCategories_1.default.find().select("_id businessName").exec();
    res.status(res.statusCode).json(docs);
}
exports.getBusinessCategories = getBusinessCategories;
async function getAdvertiserCampaigns(req, res) {
    // @ts-ignore 
    // typings for collection.countDocuments() not implemented yet
    let campaigns = await Campaigns_1.default.countDocuments({ advertiserReference: req.headers['client-ssid'] });
    res.status(res.statusCode).json(campaigns);
}
exports.getAdvertiserCampaigns = getAdvertiserCampaigns;
async function saveAdvertiserCampaign(req, res) {
    if (req.headers['client-ssid'] == undefined)
        return res.status(500).json({ error: 'NOT_LOGGEDIN' });
    let existingCampaign = await Campaigns_1.default.find({ campaignName: req.body['campaignName'] }).select('campaignName -_id').exec();
    if (existingCampaign.length > 0)
        return res.status(500).json({ error: 'MULTIPLE_CAMPAIGN_NAMES' });
    let campaign = new Campaigns_1.default({
        _id: new mongoose_1.Types.ObjectId(),
        campaignName: req.body['campaignName'],
        campaignEstimatedBudget: req.body['campaignEstimatedBudget'],
        campaignBidPerAd: req.body['campaignBidPerAd'],
        campaignBeginDate: req.body['campaignBeginDate'],
        campaignEndDate: req.body['campaignEndDate'],
        campaignTargetLocations: req.body['campaignTargetLocations'],
        campaignTargetMobile: req.body['campaignTargetMobile'] ? req.body['campaignTargetMobile'] : 'off',
        campaignTargetTablets: req.body['campaignTargetTablets'] ? req.body['campaignTargetTablets'] : 'off',
        campaignTargetDesktop: req.body['campaignTargetDesktop'] ? req.body['campaignTargetDesktop'] : 'on',
        campaignCategory: req.body['campaignCategory'],
        campaignBannedDomains: req.body['campaignBannedDomains'],
        advertiserReference: req.headers['client-ssid']
    }), saveResult = await campaign.save().catch(err => ({ error: err }));
    // @ts-ignore
    if (saveResult.error)
        return res.status(500).json({ message: 'FAILED' });
    return res.status(res.statusCode).json({ message: 'SUCCESS' });
}
exports.saveAdvertiserCampaign = saveAdvertiserCampaign;
async function getAdvertiserDetails(req, res) {
    // @ts-ignore
    let detailCheck = await AdvertiserTransactions_1.default.countDocuments({ advertiserReference: req['client']['client-ssid'] });
    if (detailCheck < 1) {
        let advertiserDetails = await Advertisers_1.default.find({ ssid: req['client']['client-ssid'] }).exec();
        return res.status(res.statusCode).json({ accountBalance: 0, fullNames: advertiserDetails[0]['fullNames'] });
    }
    let details = await AdvertiserTransactions_1.default.find({ advertiserReference: req['client']['client-ssid'] })
        .select('paidAmount advertiserReference').populate({
        path: 'advertiser',
        select: 'fullNames'
    }).exec(), accountBalance = await details.map(doc => doc['paidAmount']).reduce((a, b) => a + b), 
    // compute balance from accountBalance less billings from
    // billings collection (to be created)
    fullNames = await details.map(doc => doc['advertiser']['fullNames']).reduce(a => a);
    return res.status(res.statusCode).json({ accountBalance, fullNames });
}
exports.getAdvertiserDetails = getAdvertiserDetails;
async function getAdvertiserAdvertisements(req, res) {
    // @ts-ignore
    let advertiserAds = await Advertisements_1.default.countDocuments({ advertiserReference: req['client']['client-ssid'] });
    res.status(res.statusCode).json(advertiserAds);
}
exports.getAdvertiserAdvertisements = getAdvertiserAdvertisements;
async function saveAdvertiserAd(req, res) {
    let advert = new Advertisements_1.default({
        _id: new mongoose_1.Types.ObjectId(),
        adName: req['body']['adName'],
        adTitle: req['body']['adTitle'],
        adCampaignCategory: req['body']['adCampaignCategory'],
        adDestinationUrl: req['body']['adDestinationUrl'],
        adSelectedType: req['body']['adSelectedType'],
        adDisplayImage: req['file'] == undefined ? 'null' : req.file.filename,
        adDescription: req['body']['adDescription'],
        advertiserReference: req['client']['client-ssid'],
        adValidationTime: req['client']['validation-time']
    }), saveResult = await advert.save().catch(err => err);
    if (saveResult.toString().indexOf('ValidationError') != -1)
        return res.status(res.statusCode).json({ message: 'INVALID' });
    return res.status(res.statusCode).json({ message: 'SUCCESS' });
}
exports.saveAdvertiserAd = saveAdvertiserAd;
