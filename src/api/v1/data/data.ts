import { Types } from 'mongoose'
import { Request, Response } from 'express'
import BusinessCategories from '../../../models/BusinessCategories'
import Campaigns from '../../../models/Campaigns'
import Advertisers from '../../../models/Advertisers'
import Advertisements from '../../../models/Advertisements'
import AdvertiserTransactions from '../../../models/AdvertiserTransactions';

export async function getBusinessCategories(req: Request, res: Response) {
    await BusinessCategories.insertMany([{
        _id: new Types.ObjectId(),
        businessName: 'Fashion & Design'
    }, {
        _id: new Types.ObjectId(),
        businessName: 'Clothing, accessories, and shoes'
    }, {
        _id: new Types.ObjectId(),
        businessName: 'Computers, accessories, and services'
    }, {
        _id: new Types.ObjectId(),
        businessName: 'Entertainment and media'
    }, {
        _id: new Types.ObjectId(),
        businessName: 'Health and personal care'
    }, {
        _id: new Types.ObjectId(),
        businessName: 'Vehicle service and accessories'
    }, {
        _id: new Types.ObjectId(),
        businessName: 'Gifts and flowers'
    }, {
        _id: new Types.ObjectId(),
        businessName: 'Food retail and service'
    }, {
        _id: new Types.ObjectId(),
        businessName: 'Services - other'
    }]).catch(e => e)


    let docs = await BusinessCategories.find().select("_id businessName").exec()
    res.status(res.statusCode).json(docs)
}

export async function getAdvertiserCampaigns(req: Request, res: Response) {
    let campaigns = await Campaigns.find({ advertiserReference: req.headers['client-ssid'] })

    res.status(res.statusCode).json(campaigns)
}

export async function getCampaignsWithBsCategories(req: Request, res: Response) {
    let campaigns = await Campaigns.find({ advertiserReference: req.headers['client-ssid'] }).populate('campaignCategory')

    res.status(res.statusCode).json(campaigns)
}
export async function saveAdvertiserCampaign(req: Request, res: Response) {
    if (req.headers['client-ssid'] == undefined)
        return res.status(500).json({ error: 'NOT_LOGGEDIN' })

    let existingCampaign = await Campaigns.find({ campaignName: req.body['campaignName'] }).select('campaignName -_id').exec()

    if (existingCampaign.length > 0)
        return res.status(500).json({ error: 'MULTIPLE_CAMPAIGN_NAMES' })

    let campaign = new Campaigns({
        _id: new Types.ObjectId(),
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
    }),
        saveResult = await campaign.save().catch(err => ({ error: err }))

    // @ts-ignore
    if (saveResult.error)
        return res.status(500).json({ message: 'FAILED' })

    return res.status(res.statusCode).json({ message: 'SUCCESS' })
}

export async function getAdvertiserDetails(req: Request, res: Response) {
    // @ts-ignore
    let detailCheck = await AdvertiserTransactions.countDocuments({ advertiserReference: req['client']['client-ssid'] })
    if (detailCheck < 1) {
        let advertiserDetails = await Advertisers.find({ ssid: req['client']['client-ssid'] }).exec()
        return res.status(res.statusCode).json({ accountBalance: 0, fullNames: advertiserDetails[0]['fullNames'] })
    }
    let details = await AdvertiserTransactions.find({ advertiserReference: req['client']['client-ssid'] })
        .select('paidAmount advertiserReference').populate({
            path: 'advertiser',
            select: 'fullNames'
        }).exec(),
        accountBalance = await details.map(doc => doc['paidAmount']).reduce((a, b) => a + b),
        // compute balance from accountBalance less billings from
        // billings collection (to be created)
        fullNames = await details.map(doc => doc['advertiser']['fullNames']).reduce(a => a)

    return res.status(res.statusCode).json({ accountBalance, fullNames })
}

export async function getAdvertiserAdvertisements(req: Request, res: Response) {
    // @ts-ignore
    let advertiserAds = await Advertisements.countDocuments({ advertiserReference: req['client']['client-ssid'] })

    res.status(res.statusCode).json(advertiserAds)
}

export async function saveAdvertiserAd(req: Request, res: Response) {
    let advert = new Advertisements({
        _id: new Types.ObjectId(),
        adName: req['body']['adName'],
        adTitle: req['body']['adTitle'],
        adCampaignCategory: req['body']['adCampaignCategory'],
        adDestinationUrl: req['body']['adDestinationUrl'],
        adSelectedType: req['body']['adSelectedType'],
        adDisplayImage: req['file'] == undefined ? 'null' : req.file.filename,
        adDescription: req['body']['adDescription'],
        advertiserReference: req['client']['client-ssid'],
        adValidationTime: req['client']['validation-time']
    }),
        saveResult = await advert.save().catch(err => err)

    if (saveResult.toString().indexOf('ValidationError') != -1)
        return res.status(res.statusCode).json({ message: 'INVALID' })
    return res.status(res.statusCode).json({ message: 'SUCCESS' })
}

export async function updateCampaign(req: Request, res: Response) {
    console.log(req.body)
    await Campaigns.findOneAndUpdate({ _id: req.body['campaignId'], advertiserReference: req['client']['client-ssid'] }, { $set: {} })
}