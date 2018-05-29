"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
let router = express_1.Router();
router.post('/', (req, res) => {
    res.status(400).end(JSON.stringify({ error: 400, message: 'Bad request', info: 'Invalid endpoint url' }));
});
router.post('/login', (req, res) => {
    res.status(200).end(JSON.stringify({ message: 'accepted' }));
});
router.get('*', (req, res) => {
    res.status(400).end(JSON.stringify({ error: 400, message: 'Bad request', info: 'API only used by specific clients' }));
});
module.exports = router;
