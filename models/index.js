"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
let AdvertiserSchema = new mongoose_1.Schema({
    _id: new mongoose_1.Types.ObjectId(),
    first_name: String,
    second_name: String,
    email_address: String,
    primary_phone: Number,
    secondary_phone: Number,
    address_l1: String,
    address_l2: String,
    city: String,
    zip_code: String,
    country: String
});
