"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_1 = require("../api/v1/data/data");
const multer = require("multer");
const verify_1 = require("../api/v1/verify");
const path = require("path");
const crypto_1 = require("crypto");
const router = express_1.Router(), upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../uploads'));
        },
        filename: (req, file, cb) => {
            let customFileName = crypto_1.randomBytes(18).toString('hex'), fileExtension = file.originalname.split('.')[1];
            cb(null, customFileName + '.' + fileExtension);
        }
    })
});
router.get('/business-categories', data_1.getBusinessCategories);
router.get('/get-campaigns', verify_1.validateRequests, data_1.getAdvertiserCampaigns);
router.post('/save-campaign', verify_1.validateRequests, data_1.saveAdvertiserCampaign);
router.get('/advertiser-details', verify_1.validateRequests, data_1.getAdvertiserDetails);
router.post('/save-campaignad', upload.single('adDisplayImage'), verify_1.validateRequests, data_1.saveAdvertiserAd);
router.get('/get-advertiser-ads', verify_1.validateRequests, data_1.getAdvertiserAdvertisements);
router.post('/validate-url', verify_1.validateRequests, verify_1.validateWebsiteUrl);
router.get('/getCampaignsWithBsCategories', verify_1.validateRequests, data_1.getCampaignsWithBsCategories);
router.post('/updateCampaign', verify_1.validateRequests, data_1.updateCampaign);
router.get('/transactionHistory', verify_1.validateRequests, data_1.retrieveTransactionHistory);
router.get('/campaignStatistics', verify_1.validateRequests, data_1.retrieveCampaignStatistics);
module.exports = router;
