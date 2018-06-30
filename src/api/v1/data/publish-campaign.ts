/*
 * Danny Sofftie <dankim761@gmail.com> 28th June 2018
 * Utilities for publishing campaigns and ads to datastore
 */

import { Request, Response } from 'express'

interface CampaignData {
    campaignName: string,
    estimatedDailyBudget: string | number
}

interface AdData {

}

/**
 * publish campaign to datastore
 * @param {Request} req request object
 * @param {Response} res response object
 */
export async function publishCampaign(req: Request, res: Response) {

}

/**
 * publish ad to datastore
 * @param {Request} req request object
 * @param {Response} res response object
 */
export async function publishAdvertisement(req: Request, res: Response) {
    console.log(req.body)
    res.status(res.statusCode).json({message:'success'})
}