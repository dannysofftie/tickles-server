"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
let BusinessCategories = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    businessName: { type: String, required: true, unique: true }
});
exports.default = mongoose_1.model('BusinessCategories', BusinessCategories);
