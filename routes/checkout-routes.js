"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkout_1 = require("../api/v1/checkout");
const verify_1 = require("../api/v1/verify");
const router = express_1.Router({ caseSensitive: true, strict: true });
router.post('/', (req, res) => {
    res.status(400).end(JSON.stringify({ error: 400, message: 'Bad request', info: 'Unauthorized' }));
});
router.post('/paypal', verify_1.validateRequests, checkout_1.checkoutPayPal);
router.get('/payment-wallet', checkout_1.receivePaypalPayment);
// router.post('/paypal', validateRequests, Checkout["export="].checkoutPayPal)
// router.post('/mpesa', validateRequests, Checkout["export="].checkoutMpesa)
router.get('*', (req, res) => {
    res.status(400).json({ error: 400, message: 'Bad request', info: 'API only used by specific clients' });
});
module.exports = router;
