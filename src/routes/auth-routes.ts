import { Router } from 'express'
import * as auth from '../api/v1/auth'

const router: Router = Router({ caseSensitive: true, strict: true })


router.post('/client/signup', auth.advertiserSignUp)

router.post('/client/login', auth.advertiserLogin)



// FALLBACK FOR UNHANDLED ENDPOINTS
router.post('*', (req, res) => {
    res.status(400).end(JSON.stringify({ error: 400, message: 'Bad request', info: 'Invalid endpoint url' }))
})
router.get('*', (req, res) => {
    res.status(400).end(JSON.stringify({ error: 400, message: 'Bad request', info: 'Invalid endpoint url' }))
})

module.exports = router