import { Response, Request, NextFunction } from "express"
import * as ip2location from 'ip2location-nodejs'
import * as path from 'path'

/**
 * Gets location, latitude and longitude the request is coming from,
 * based on client ip address
 */
export async function locationGeocode(req: Request, res: Response, next: NextFunction) {

  ip2location.IP2Location_init(path.join(__dirname, '../', '../', '../', 'tracer/IP2LOCATION-LITE-DB5.IPV6.BIN'))

  // find a way to obtain public ip address,
  // pass the public ip to ip database for location search
  try {
    const result = await ip2location.IP2Location_get_all(req.ip)

    req['client-location'] = result
  } catch{ req['client-location'] = false }
  return next() // pass request to ad serving utility
}
