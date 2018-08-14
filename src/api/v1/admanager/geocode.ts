import { Response, Request, NextFunction } from "express"
import * as ip2location from 'ip2location-nodejs'
import * as path from 'path'
import * as superagent from 'superagent'
/**
 * Gets location, latitude and longitude the request is coming from,
 * based on client ip address
 */
export async function locationGeocode(req: Request, res: Response, next: NextFunction) {

  ip2location.IP2Location_init(path.join(__dirname, '../', '../', '../', 'tracer/IP2LOCATION-LITE-DB5.IPV6.BIN'))

  const ip = await (async () => {
    return new Promise((resolve, reject) => {
      superagent.get('http://ip.cn').set('User-Agent', 'curl/7.37.1')
        .end(function (err, res) {
          try {
            var ip = res.text.match(/\d+\.\d+\.\d+\.\d+/)[0]
            return resolve(ip)
          } catch{ resolve(req.ip) }
        })
    })
  })()

  // find a way to obtain public ip address,
  // pass the public ip to ip database for location search
  try {
    const result = await ip2location.IP2Location_get_all(ip)

    req['client-location'] = result
  } catch{ req['client-location'] = false }
  return next() // pass request to ad serving utility
}
