import { Router } from 'express'
import { getBusinessCategories, getAdvertiserCampaigns } from '../api/v1/data/data'

const router: Router = Router()

router.get('/business-categories', getBusinessCategories)

router.get('/get-campaigns', getAdvertiserCampaigns)

module.exports = router