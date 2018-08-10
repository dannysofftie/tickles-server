"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../api/v1/auth");
const router = express_1.Router({ caseSensitive: true, strict: true });
router.post('/client/signup', auth_1.advertiserSignUp);
router.post('/client/login', auth_1.advertiserLogin);
router.post('/verifyPaypal', auth_1.verifyPaypal);
// FALLBACK FOR UNHANDLED ENDPOINTS
router.post('*', (req, res) => {
    res.status(400).end(JSON.stringify({ error: 400, message: 'Bad request', info: 'Invalid endpoint url' }));
});
router.get('*', (req, res) => {
    res.status(400).end(JSON.stringify({ error: 400, message: 'Bad request', info: 'Invalid endpoint url' }));
});
module.exports = router;
