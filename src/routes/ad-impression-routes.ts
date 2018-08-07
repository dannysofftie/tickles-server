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

import { Router } from 'express'

const router: Router = Router()

// handles click events on ads
router.get('/click/:visitorSessionId/:destinationUrl/:advertiserReference', (req, res) => {

    //http://127.0.0.1:5000/api/v1/impression/click/TVRJM0xqQXVNQzR4Zkh3Nk9tWm1abVk2TVRJM0xqQXVNQzR4fHwxNTMzNTYzODY1NzEy/example.com/ZGFua2ltNzYxQGdtYWlsLmNvbTpEYW5ueSBTb2ZmdGll
    res.status(301).redirect('http://' + req.params['destinationUrl'])

})

// handles views, when an ad appears on the viewport
router.get('/view', (req, res) => {

    // res.status(301).redirect('http://' + req.params['destination'])

})

// handle events when an ad is clicked twice
router.get('/boubleclick', (req, res) => {

    // res.status(301).redirect('http://' + req.params['destination'])

})

router.get('/', (req, res) => {

    // res.status(301).redirect('http://' + req.params['destination'])

})
export = router