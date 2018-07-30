import { Router } from 'express'
import { requestSessionBuilder } from '../api/v1/sessions'
import { locationGeocode, adServicePoint } from '../api/v1/admanager'
const router: Router = Router()

// manage ads, serve requests, manage impressions, views, clicks and record updates
router.get('/publisher', requestSessionBuilder, /*locationGeocode,*/ adServicePoint)

router.get('/impression/click/:origin/:timestamp/:adreference/:destination', locationGeocode, (req, res) => {
    console.log(req.params)
    res.status(301).redirect('http://' + req.params['destination'])
    // next()
})

module.exports = router