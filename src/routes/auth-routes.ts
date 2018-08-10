import { Router } from 'express'
import { advertiserSignUp, advertiserLogin, verifyPaypal } from '../api/v1/auth'

const router: Router = Router({ caseSensitive: true, strict: true })


router.post('/client/signup', advertiserSignUp)

router.post('/client/login', advertiserLogin)

router.post('/verifyPaypal', verifyPaypal)


// FALLBACK FOR UNHANDLED ENDPOINTS
router.post('*', (req, res) => {
    res.status(400).end(JSON.stringify({ error: 400, message: 'Bad request', info: 'Invalid endpoint url' }))
})
router.get('*', (req, res) => {
    res.status(400).end(JSON.stringify({ error: 400, message: 'Bad request', info: 'Invalid endpoint url' }))
})

module.exports = router