"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BusinessCategories_1 = require("../../../models/BusinessCategories");
const Campaigns_1 = require("../../../models/Campaigns");
const Advertisers_1 = require("../../../models/Advertisers");
const Advertisements_1 = require("../../../models/Advertisements");
const AdvertiserTransactions_1 = require("../../../models/AdvertiserTransactions");
const Referrals_1 = require("../../../models/Referrals");
const PublisherAdSession_1 = require("../../../models/PublisherAdSession");
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
    let campaigns = await Campaigns_1.default.find({ advertiserReference: req.headers['client-ssid'] });
    res.status(res.statusCode).json(campaigns);
}
exports.getAdvertiserCampaigns = getAdvertiserCampaigns;
async function getCampaignsWithBsCategories(req, res) {
    let campaigns = await Campaigns_1.default.find({ advertiserReference: req.headers['client-ssid'] }).populate('campaignCategory');
    res.status(res.statusCode).json(campaigns);
}
exports.getCampaignsWithBsCategories = getCampaignsWithBsCategories;
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
    let advertiserDetails = await Advertisers_1.default.find({ ssid: req['client']['client-ssid'] }).exec();
    return res.status(res.statusCode).json(advertiserDetails);
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
async function updateCampaign(req, res) {
    // find a way to update campaigns on checkbox toggle
    console.log(req.body);
    await Campaigns_1.default.findOneAndUpdate({ _id: req.body['campaignId'], advertiserReference: req['client']['client-ssid'] }, { $set: {} });
}
exports.updateCampaign = updateCampaign;
async function retrieveTransactionHistory(req, res) {
    let transactionHistory = await AdvertiserTransactions_1.default.aggregate([
        {
            $match: { advertiserReference: req['client']['client-ssid'] }
        }, {
            $project: { paymentSource: 1, topUpDate: 1, paidAmount: 1, paymentState: 1, payerEmail: 1 }
        }, {
            $sort: { topUpDate: -1 }
        }
    ]).limit(8), referralAwards = await Referrals_1.default.aggregate([
        {
            $match: {
                advertiserReference: req['client']['client-ssid']
            }
        }, {
            $unwind: '$referrees'
        }, {
            $group: {
                _id: '$advertiserReference',
                revenue: { $sum: '$referrees.revenue' }
            }
        }
    ]);
    return res.status(res.statusCode).json({ transactionHistory: transactionHistory, referralAwards: referralAwards });
}
exports.retrieveTransactionHistory = retrieveTransactionHistory;
async function retrieveCampaignStatistics(req, res) {
    let data = await Campaigns_1.default.aggregate([
        {
            $match: { advertiserReference: req['client']['client-ssid'] }
        }, {
            $lookup: {
                from: 'advertisements',
                localField: '_id',
                foreignField: 'adCampaignCategory',
                as: 'ads'
            }
        }, {
            $unwind: '$ads'
        }, {
            $lookup: {
                from: 'clientadinteractions',
                localField: 'ads._id',
                foreignField: 'adReference',
                as: 'interactions'
            }
        }, {
            $unwind: '$interactions'
        }, {
            $group: {
                _id: { adId: '$ads._id', campaignName: '$campaignName', adName: '$ads.adName' },
                impressions: { $sum: 1 },
                views: { $sum: '$interactions.interactionType.view' },
                clicks: { $sum: '$interactions.interactionType.click' },
                doubleclicks: { $sum: '$interactions.interactionType.doubleClick' }
            }
        }
    ]);
    return res.status(res.statusCode).json(data);
}
exports.retrieveCampaignStatistics = retrieveCampaignStatistics;
async function retrievePublisherData(req, res) {
    let pudData = await PublisherAdSession_1.default.aggregate([
        {
            $unwind: '$clientCookies'
        }, {
            $lookup: {
                from: 'publishers',
                localField: 'clientCookies.original-url',
                foreignField: 'publisherAppUrl',
                as: 'publisher'
            }
        }, {
            $project: { 'publisher.publisherSsid': 1, visitorLocation: 1 }
        }, {
            $unwind: '$publisher'
        }, {
            $match: { 'publisher.publisherSsid': req.headers['client-ssid'] }
        }, {
            $project: { visitorLocation: 1, _id: 0 }
        }
    ]);
    return res.status(res.statusCode).json(pudData);
}
exports.retrievePublisherData = retrievePublisherData;
async function deleteAdFromRecords(req, res) {
    await Advertisements_1.default.findOneAndRemove({ _id: req.query['id'] }).exec();
    res.status(res.statusCode).json({ status: 'success' });
}
exports.deleteAdFromRecords = deleteAdFromRecords;
