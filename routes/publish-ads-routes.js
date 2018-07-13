"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer = require("multer");
const router = express_1.Router(), upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/client');
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    }),
    limits: { fileSize: 1024 * 1024 * 2 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == 'image/png' || file.mimetype == 'image/jpeg')
            cb(null, true);
        else
            cb(null, false);
    }
});
// manage campaign and ad publishing 
// router.post('/publish-campaign', publishCampaign)
// router.post('/publish-ad', upload.single('adDisplayImage'), publishAdvertisement)
module.exports = router;