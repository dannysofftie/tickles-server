"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BusinessCategories_1 = require("../../../models/BusinessCategories");
const Campaigns_1 = require("../../../models/Campaigns");
const Advertisers_1 = require("../../../models/Advertisers");
const Advertisements_1 = require("../../../models/Advertisements");
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
    let campaigns = await Campaigns_1.default.find({ advertiserReference: req.headers['client-ssid'] }).select('_id campaignName').exec();
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
    let details = await Advertisers_1.default.find({ ssid: req.headers['client-ssid'] }).select('fullNames accountBalance -_id').exec();
    res.status(res.statusCode).json(details);
}
exports.getAdvertiserDetails = getAdvertiserDetails;
async function getAdvertiserAdvertisements(req, res) {
    // console.log(req.headers['client-ssid'])
    res.status(res.statusCode).json([]);
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
    console.log(saveResult);
    if (saveResult.toString().indexOf('ValidationError') != -1)
        return res.status(res.statusCode).json({ message: 'INVALID' });
    return res.status(res.statusCode).json({ message: 'SUCCESS' });
}
exports.saveAdvertiserAd = saveAdvertiserAd;
