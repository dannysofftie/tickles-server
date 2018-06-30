"use strict";
/*
 * Danny Sofftie <dankim761@gmail.com> 28th June 2018
 * Utilities for publishing campaigns and ads to datastore
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * publish campaign to datastore
 * @param {Request} req request object
 * @param {Response} res response object
 */
async function publishCampaign(req, res) {
}
exports.publishCampaign = publishCampaign;
/**
 * publish ad to datastore
 * @param {Request} req request object
 * @param {Response} res response object
 */
async function publishAdvertisement(req, res) {
    console.log(req.body);
    res.status(res.statusCode).json({ message: 'success' });
}
exports.publishAdvertisement = publishAdvertisement;
