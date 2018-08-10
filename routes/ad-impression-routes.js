"use strict";
/*

MIT License

Copyright (c) 2018 Danny Sofftie

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 
*/
const express_1 = require("express");
const Billings_1 = require("../models/Billings");
const mongoose_1 = require("mongoose");
const ClientAdInteractions_1 = require("../models/ClientAdInteractions");
const router = express_1.Router();
// handles click events on ads
router.get('/click/:visitorSessionId/:adReference/:destinationUrl/:advertiserReference', async (req, res) => {
    await ClientAdInteractions_1.default.findOneAndUpdate({
        visitorInstanceId: req.params['visitorSessionId']
    }, {
        $inc: { 'interactionType.click': 1 }
    }, {
        new: true
    });
    await new Billings_1.default({
        _id: new mongoose_1.Types.ObjectId(),
        advertiserReference: req.params['advertiserReference'],
        adReference: req.params['adReference'],
        impression: 'click',
        visitorSessionId: req.params['visitorSessionId'],
        referencedPublisher: req.params['destinationUrl']
    }).save();
    res.status(301).redirect('http://' + req.params['destinationUrl']);
});
// handles views, when an ad appears on the viewport
router.get('/view', (req, res) => {
    // res.status(301).redirect('http://' + req.params['destination'])
});
// handle events when an ad is clicked twice
router.get('/boubleclick', (req, res) => {
    // res.status(301).redirect('http://' + req.params['destination'])
});
router.get('/', (req, res) => {
    // res.status(301).redirect('http://' + req.params['destination'])
});
module.exports = router;
