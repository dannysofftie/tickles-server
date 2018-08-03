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
import { requestSessionBuilder } from '../api/v1/sessions'
import { estimatedDeviceSizeAdsBuilder, locationGeocode, adDataToDeliver } from '../api/v1/admanager'
const router: Router = Router({ caseSensitive: true, strict: true })

// first request from publisher sites hits this end point
// publisher details are collected, and a session built for this particular instance
// subsequent requets from a common ip address reuse the already built session
router.get('/publisher', requestSessionBuilder, estimatedDeviceSizeAdsBuilder)

// when this endpoint is hit, the previously built session is used to find relevant ad
// as per the device size, and the container to which an ad has been initialized
// by the publisher using new Tickles().init('element-id')
// returns a single instance for a particular campaign, with ad data that will be used in display
router.get('/addata', locationGeocode, adDataToDeliver)


module.exports = router