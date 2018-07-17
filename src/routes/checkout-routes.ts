import { Router } from 'express'
import { checkoutPayPal, receivePaypalPayment } from '../api/v1/checkout'
import { validateRequests } from '../api/v1/verify'

const router: Router = Router({ caseSensitive: true, strict: true })

router.post('/', (req, res) => {
    res.status(400).end(JSON.stringify({ error: 400, message: 'Bad request', info: 'Unauthorized' }))
})

router.post('/paypal', validateRequests, checkoutPayPal)

router.get('/payment-wallet', receivePaypalPayment)
// router.post('/paypal', validateRequests, Checkout["export="].checkoutPayPal)

// router.post('/mpesa', validateRequests, Checkout["export="].checkoutMpesa)

router.get('*', (req, res) => {
    res.status(400).json({ error: 400, message: 'Bad request', info: 'API only used by specific clients' })
})


module.exports = router