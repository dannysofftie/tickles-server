import { Request, Response, NextFunction } from 'express'
import { extractRequestCookies } from "../utils/origin-cookies"
import Publisher from '../../../models/Publisher'

interface T {
    Edge: RegExp,
    Firefox: RegExp,
    IE: RegExp,
    Chrome: RegExp,
    Chromium: RegExp,
    Safari: RegExp,
    Opera: RegExp,
    Facebook: RegExp,
    WebKit: RegExp,
    UC: RegExp
}
interface B {
    Edge: RegExp,
    Chromium: RegExp,
    Chrome: RegExp,
    Safari: RegExp,
    IE: RegExp,
    Opera: RegExp,
    Firefox: RegExp,
    UC: RegExp,
    Facebook: RegExp
}
/**
 * @description Session builder middleware for all requests tunneling from publisher sites & apps.
 * Handles:
 *  - Publisher site's ad requests, obtains request information and sets sessions for specific requests
 *  - Ad view responses from publisher sites and sets sessions appropriate for this particular scenario
 *  - Ad impressions responses from publisher sites and sets session appropriate for this particular scenario
 *  - Ad click responses from publisher sites and sets session appropriate for ad clicks
 * 
 */
class SessionBuilder {
    public async requestSessionBuilder(req: Request) {
        const cookies: {} = await extractRequestCookies(req.headers.cookie),
            userAgent: string = <string>req['headers']['user-agent'],
            browserVersions: T = {
                Edge: /(?:edge|edga|edgios)\/([\d\w\.\-]+)/i,
                Firefox: /(?:firefox|fxios)\/([\d\w\.\-]+)/i,
                IE: /msie\s([\d\.]+[\d])|trident\/\d+\.\d+;.*[rv:]+(\d+\.\d)/i,
                Chrome: /(?:chrome|crios)\/([\d\w\.\-]+)/i,
                Chromium: /chromium\/([\d\w\.\-]+)/i,
                Safari: /version\/([\d\w\.\-]+)/i,
                Opera: /version\/([\d\w\.\-]+)|OPR\/([\d\w\.\-]+)/i,
                Facebook: /FBAV\/([\d\w\.]+)/i,
                WebKit: /applewebkit\/([\d\w\.]+)/i,
                UC: /ucbrowser\/([\d\w\.]+)/i
            },
            broswers: B = {
                Edge: /edge|edga|edgios/i,
                Chromium: /chromium/i,
                Chrome: /chrome|crios/i,
                Safari: /safari/i,
                IE: /msie|trident/i,
                Opera: /opera|OPR\//i,
                Firefox: /firefox|fxios/i,
                UC: /UCBrowser/i,
                Facebook: /FBA[NV]/
            },
            operatingSystem = {
                Windows10: /windows nt 10\.0/i,
                Windows81: /windows nt 6\.3/i,
                Windows8: /windows nt 6\.2/i,
                Windows7: /windows nt 6\.1/i,
                WindowsXP: /windows nt 5\.1/i,
                WindowsPhone: /windows phone/i,
                Mac: /os x/i,
                Linux: /linux/i,
                Linux64: /linux x86\_64/i,
                ChromeOS: /cros/i,
                iPad: /\(iPad.*os (\d+)[._](\d+)/i,
                iPhone: /\(iPhone.*os (\d+)[._](\d+)/i,
                iOS: /ios/i
            },
            platform = {
                Windows: /windows nt/i,
                WindowsPhone: /windows phone/i,
                Mac: /macintosh/i,
                Linux: /linux/i,
                iPad: /ipad/i,
                iPod: /ipod/i,
                iPhone: /iphone/i,
                Android: /android/i,
                Blackberry: /blackberry/i,
                Samsung: /samsung/i,
                iOS: /^ios\-/i
            }


        const getBroswer = function () {
            switch (true) {
                case broswers.Chrome.test(userAgent): return 'Chrome'
                case broswers.Firefox.test(userAgent): return 'Firefox'
                case broswers.IE.test(userAgent): return 'Internet Explorer'
                case broswers.Edge.test(userAgent): return 'Edge'
                case broswers.Opera.test(userAgent): return 'Opera'
                case broswers.UC.test(userAgent): return 'UC Browser'
                case broswers.Safari.test(userAgent): return 'Safari'
                default: return null
            }
        }

        const getBrowserVersion = function () {
            if (browserVersions[getBroswer()].test(userAgent))
                return RegExp.$1;
            return null
        }

        const getOperatingSytem = function () {
            let s = ''
            for (let p in operatingSystem) {
                if (operatingSystem[p].test(userAgent))
                    s = p;
            }
            return s
        }

        const getPlatform = function () {
            let s = ''
            for (let p in platform) {
                if (platform[p].test(userAgent))
                    s = p;
            }
            return s
        }

        const getDevice = function () {
            let device = 'Desktop'
            if (/mobile/i.test(userAgent)) {
                let regex = new RegExp('(' + getPlatform() + '(\\s\\d{0,}(\\.\\d{0,})?(\\.\\d+)?)?);\\s([a-z]{0,}\-?[a-z0-9]{0,})\\s', 'i')
                if (regex.test(userAgent))
                    device = RegExp.$5
            }
            return device;
        }

        const requestSession = {
            'client-ip': req.ip,
            'client-cookies': cookies,
            'client-device': getDevice(),
            'client-browser': getBroswer(),
            'client-browser-version': getBrowserVersion(),
            'client-operating-system': getOperatingSytem(),
            'site-visited': req.hostname,
            'site-section': req.originalUrl,
            'site-current-url': req.hostname + req.originalUrl
        }
        req['client-session'] = requestSession
        return
    }

    public adClickSessionBuilder(req: Request) {

    }

    public adViewSessionBuilder(req: Request) {

    }

    public adImpressionSessionBuilder(req: Request) {

    }
}

/**
 * exposes a top level session builder middleware for all requests tunnelling from publisher sites and apps
 * creates appropriate data for a particular instance of client interaction with the ad server
 * 
 * @param req client Request object
 * @param res server Response object
 */
export async function requestSessionBuilder(req: Request, res: Response, next: NextFunction) {
    await new SessionBuilder().requestSessionBuilder(req).catch(e => req['client-session'] = false)
    // confirm site registration
    // let pubCheck = await Publisher.find({ publisherAppUrl: req['client-session']['site-visited'] }).select('publisherAppUrl').exec()
    // if (pubCheck.length < 1)
    //     return res.end()
    return next()  // forward to the next utility after build complete
}