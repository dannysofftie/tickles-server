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

import { Request, Response } from 'express'

/**
 * Uses previously built session visitor's cookies, device size, and incoming request's element size
 * for ad placement. The element size in this case, `width & height` is used to determine the ad to deliver,
 * depending on the uploaded image size. If no image was uploaded, a fallback to default Tickles Ad logo,
 * will be used. Tickles Ad has all image sizes, as specified in publisher's recommended element/ad sizes
 */
class AdBuilder {

}

/**
 * An intance of 
 *      - class AdBuilder{}
 * Uses previously built session visitor's cookies, device size, and incoming request's element size
 * for ad placement. The element size in this case, `width & height` is used to determine the ad to deliver,
 * depending on the uploaded image size. If no image was uploaded, a fallback to default Tickles Ad logo,
 * will be used. Tickles Ad has all image sizes, as specified in publisher's recommended element/ad sizes
 * 
 *  - Responds with ad data for delivery
 */
export async function adDataToDeliver(req: Request, res: Response) {
    // get cookies from database
    console.log(req.query)
    res.status(200).json({ data: 'server responded' })
}