"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
let router = express_1.Router();
router.get('/advertiser', (req, res) => {
});
router.post('/advertiser/login', (req, res) => {
    console.log(req.body);
});
module.exports = router;
