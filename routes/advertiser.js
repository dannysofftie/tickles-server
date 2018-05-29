"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const utils = require("../utils");
let router = express_1.Router({ caseSensitive: true, strict: true });
router.post('/', (req, res) => {
    res.status(400).end(JSON.stringify({ error: 400, message: 'Bad request', info: 'Invalid endpoint url' }));
});
router.post('/login', async (req, res) => {
    let response = await utils.advertiserLogin(req.body).catch(err => err);
    res.status(200).end(JSON.stringify(response));
});
module.exports = router;
