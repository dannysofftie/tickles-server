"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_1 = require("../api/v1/data/data");
const router = express_1.Router();
router.get('/business-categories', data_1.getBusinessCategories);
router.get('/get-campaigns', data_1.getAdvertiserCampaigns);
module.exports = router;
