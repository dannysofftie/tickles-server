"use strict";
const express_1 = require("express");
const router = express_1.Router();
router.get('/click/:origin/:timestamp/:adreference/:destination', (req, res, next) => {
    console.log(req.params);
    res.status(301).redirect('http://' + req.params['destination']);
    // next()
});
module.exports = router;
