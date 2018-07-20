import { Response, Request, NextFunction } from "express"
import * as ip2location from 'ip2location-nodejs'
import * as path from 'path'

/**
 * Builds location based on client ip address
 */
export async function locationFinder(req: Request, res: Response, next: NextFunction) {
  ip2location.IP2Location_init(path.join(__dirname, '../', '../', '../', 'tracer/IP2LOCATION-LITE-DB5.IPV6.BIN'))

  // find a way to obtain public ip address,
  // pass the public ip to ip database for location search

  const result = ip2location.IP2Location_get_all(req.ip)

  console.log(result)
  return next()
}
