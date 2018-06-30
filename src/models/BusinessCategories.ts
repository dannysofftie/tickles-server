import { Schema, Types, model } from 'mongoose'

let BusinessCategories: Schema = new Schema({
    _id: Schema.Types.ObjectId,
    businessName: { type: String, required: true, unique: true }
})

export default model('BusinessCategories', BusinessCategories) 