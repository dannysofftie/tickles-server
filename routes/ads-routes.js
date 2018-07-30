"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sessions_1 = require("../api/v1/sessions");
const admanager_1 = require("../api/v1/admanager");
const router = express_1.Router();
// manage ads, serve requests, manage impressions, views, clicks and record updates
router.get('/publisher', sessions_1.requestSessionBuilder, /*locationGeocode,*/ admanager_1.adServicePoint);
router.get('/impression/click/:origin/:timestamp/:adreference/:destination', admanager_1.locationGeocode, (req, res) => {
    console.log(req.params);
    res.status(301).redirect('http://' + req.params['destination']);
    // next()
});
module.exports = router;
