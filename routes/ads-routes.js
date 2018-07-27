"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sessions_1 = require("../api/v1/sessions");
const admanager_1 = require("../api/v1/admanager");
const router = express_1.Router();
// manage ads, serve requests, manage impressions, views, clicks and record updates
router.get('/publisher', sessions_1.requestSessionBuilder, admanager_1.locationGeocode, admanager_1.adServicePoint);
module.exports = router;
