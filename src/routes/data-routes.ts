import { Router } from 'express'
import { getBusinessCategories, getAdvertiserCampaigns, saveAdvertiserAd, saveAdvertiserCampaign, getAdvertiserDetails, getAdvertiserAdvertisements } from '../api/v1/data/data'
import * as multer from 'multer'
import { validateAdDestinationUrl, validateRequests } from '../api/v1/verify'
import * as path from 'path'
import { randomBytes } from 'crypto'

const router: Router = Router(),
    upload = multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, path.join(__dirname, '../uploads'))
            },
            filename: (req, file, cb) => {
                let customFileName = randomBytes(18).toString('hex'),
                    fileExtension = file.originalname.split('.')[1]
                cb(null, customFileName + '.' + fileExtension)
            }
        })
    })

router.get('/business-categories', getBusinessCategories)

router.get('/get-campaigns', validateRequests, getAdvertiserCampaigns)

router.post('/save-campaign', validateRequests, saveAdvertiserCampaign)

router.get('/advertiser-details', validateRequests, getAdvertiserDetails)

router.post('/save-campaignad', upload.single('adDisplayImage'), validateRequests, saveAdvertiserAd)

router.get('/get-advertiser-ads', validateRequests, getAdvertiserAdvertisements)

router.post('/validate-url', validateRequests, validateAdDestinationUrl)

module.exports = router