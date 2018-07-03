import { Types, connection } from 'mongoose';
import { Request, Response } from 'express';
import BusinessCategories from '../../../models/BusinessCategories'

export async function getBusinessCategories(req: Request, res: Response) {
    await BusinessCategories.insertMany([{
        _id: new Types.ObjectId(),
        businessName: 'Fashion & Design'
    }, {
        _id: new Types.ObjectId(),
        businessName: 'Clothing, accessories, and shoes'
    }, {
        _id: new Types.ObjectId(),
        businessName: 'Computers, accessories, and services'
    }, {
        _id: new Types.ObjectId(),
        businessName: 'Entertainment and media'
    }, {
        _id: new Types.ObjectId(),
        businessName: 'Health and personal care'
    }, {
        _id: new Types.ObjectId(),
        businessName: 'Vehicle service and accessories'
    }, {
        _id: new Types.ObjectId(),
        businessName: 'Gifts and flowers'
    }, {
        _id: new Types.ObjectId(),
        businessName: 'Food retail and service'
    }, {
        _id: new Types.ObjectId(),
        businessName: 'Services - other'
    }]).catch(e => e)
    let docs = await BusinessCategories.find().select("_id businessName").exec()
    res.status(res.statusCode).json(docs)
}

export async function getAdvertiserCampaigns(req: Request, res: Response) {

}