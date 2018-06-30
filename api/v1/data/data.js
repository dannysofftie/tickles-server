"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BusinessCategories_1 = require("../../../models/BusinessCategories");
async function getBusinessCategories(req, res) {
    await BusinessCategories_1.default.insertMany([{
            _id: new mongoose_1.Types.ObjectId(),
            businessName: 'Fashion & Design'
        }, {
            _id: new mongoose_1.Types.ObjectId(),
            businessName: 'Clothing, accessories, and shoes'
        }, {
            _id: new mongoose_1.Types.ObjectId(),
            businessName: 'Computers, accessories, and services'
        }, {
            _id: new mongoose_1.Types.ObjectId(),
            businessName: 'Entertainment and media'
        }, {
            _id: new mongoose_1.Types.ObjectId(),
            businessName: 'Health and personal care'
        }, {
            _id: new mongoose_1.Types.ObjectId(),
            businessName: 'Vehicle service and accessories'
        }, {
            _id: new mongoose_1.Types.ObjectId(),
            businessName: 'Gifts and flowers'
        }, {
            _id: new mongoose_1.Types.ObjectId(),
            businessName: 'Food retail and service'
        }, {
            _id: new mongoose_1.Types.ObjectId(),
            businessName: 'Services - other'
        }]).catch(e => e);
    let docs = await BusinessCategories_1.default.find().select("_id businessName").exec();
    res.status(res.statusCode).json(docs);
}
exports.getBusinessCategories = getBusinessCategories;
async function getAdvertiserCampaigns(req, res) {
}
exports.getAdvertiserCampaigns = getAdvertiserCampaigns;
