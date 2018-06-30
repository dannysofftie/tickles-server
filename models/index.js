"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BusinessCategories_1 = require("./BusinessCategories");
// check if businessCategories collection exists in database
async function checkBusinessGroups() {
    return await new BusinessCategories_1.default({
        _id: new mongoose_1.Types.ObjectId(),
        businessName: 'Fashion & Design',
        businessCode: '53G8GY'
    }).save((err, docs) => docs);
    // let cols = await BusinessCategories.db.db.listCollections({ name: 'BusinessCategories' }).toArray()
    // console.log(cols)
}
exports.checkBusinessGroups = checkBusinessGroups;
