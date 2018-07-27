import { Router } from 'express'

const router: Router = Router()

router.get('/click/:origin/:timestamp/:adreference/:destination', (req, res, next) => {
    console.log(req.params)
    res.status(301).redirect('http://' + req.params['destination'])
    // next()
})

export = router