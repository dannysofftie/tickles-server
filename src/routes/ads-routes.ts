import { Router } from 'express'
import { requestSessionBuilder } from '../api/v1/sessions'
import { locationGeocode, adServicePoint } from '../api/v1/admanager'
const router: Router = Router()

// manage ads, serve requests, manage impressions, views, clicks and record updates
router.get('/publisher', requestSessionBuilder, locationGeocode, adServicePoint)

module.exports = router