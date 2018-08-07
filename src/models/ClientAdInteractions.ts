/*

MIT License

Copyright (c) 2018 Danny Sofftie

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
import { Schema, model } from 'mongoose'

const ClientAdInteractions = new Schema({
    _id: {
        type: String,
        required: true
    }, publisherSessionId: {
        type: String,
        required: true
    }, visitorInstanceId: {
        // a unique session id generated from publisherSessionId, and current time (base64 encoded)
        type: String,
        required: true
    }, adReference: {
        type: Schema.Types.ObjectId,
        ref: 'Advertisements',
        required: true
    }, deliveryStatus: {
        type: Boolean,
        required: true,
        default: false
    }, deliveryDate: {
        type: Date,
        default: Date.now,
        required: false
    }, interactionDate: {
        type: Date,
        required: false
    }, interactionType: {
        view: {
            type: Number,
            required: false,
            default: 0
        },
        click: {
            type: Number,
            required: false,
            default: 0
        },
        doubleClick: {
            type: Number,
            required: false,
            default: 0
        }
    },
    impressionDuration: {
        type: Number,
        default: 0,
        required: false
    }, billedAmount: {
        type: Number,
        required: false,
        default: 0
    }, billedStatus: {
        type: Boolean,
        default: false,
        required: false
    }
})


export default model('ClientAdInteraction', ClientAdInteractions)