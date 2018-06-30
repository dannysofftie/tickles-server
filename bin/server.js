#!/usr/bin/env node
"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const cluster = require("cluster");
const cors = require("cors");
const express = require("express");
const http_1 = require("http");
const os = require("os");
const mongoose = require("mongoose");
class TicklesAdServer {
    constructor() {
        this.PORT = process.env.PORT || 5000;
        this.app = express();
        this.server = http_1.createServer(this.app);
        this.ENV_CPUS = process.env.NODE_ENV === 'production' ? os.cpus().length : 1;
        this.MONGO_URI = process.env.NODE_ENV === 'production' ? 'mongodb+srv://dannysofftie:25812345Dan@project-adexchange-bftmj.gcp.mongodb.net/test?retryWrites=true' : 'mongodb://127.0.0.1/project-adexchange';
        this.configs();
        this.routes();
    }
    configs() {
        this.app.disable('x-powered-by');
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(cors());
        this.app.use((req, res, next) => {
            res.setHeader('X-Powered-By', 'Go-langV1.10.3');
            next();
        });
        mongoose.connect(this.MONGO_URI);
    }
    routes() {
        // handle authentication requests
        this.app.use('/api/v1/auth', require('../routes/auth-routes'));
        // handle data requests
        this.app.use('/api/v1/data', require('../routes/data-routes'));
        // handle requests to publisher content, including serving ads to publisher websites and other online apps
        this.app.use('/api/v1/pub-content', require('../routes/pub-routes'));
        // handle ad views, impressions and clicks
        this.app.use('/api/v1/cnb', require('../routes/ads-routes'));
        // handle ad and campaign publishing
        this.app.use('/api/v1/publish', require('../routes/publish-ads-routes'));
        // fallback for unhandled get requests
        this.app.get('*', (req, res) => {
            res.status(400).end(JSON.stringify({ error: 400, message: 'Bad request', info: 'Server only accepts requests from specific clients' }));
        });
        // fallback for unhandled post requests
        this.app.post('*', (req, res) => {
            res.status(400).end(JSON.stringify({ error: 400, message: 'Bad request', info: 'Invalid endpoint' }));
        });
    }
    normalizePort(port) {
        if (typeof port == 'function') {
            throw new TypeError('Argument of type function can\'t used as port');
        }
        else if (typeof port == 'string') {
            return Number.isNaN(parseInt(port)) ? process.exit(1) : parseInt(port);
        }
        else if (typeof port == 'undefined') {
            throw new Error('Expected parameter port number but found none');
        }
        else if (typeof port == 'object') {
            throw new TypeError('Argument of type object can\'t be used as port');
        }
        else if (isNaN(port)) {
            return 4000;
        }
        return port;
    }
    async startServer() {
        var e_1, _a;
        if (cluster.isMaster) {
            for (let i = 0; i < this.ENV_CPUS; i++) {
                cluster.fork();
            }
            try {
                for (var _b = __asyncValues(['disconnect', 'exit']), _c; _c = await _b.next(), !_c.done;) {
                    const event = _c.value;
                    cluster.on(event, () => cluster.fork());
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        else {
            let port = this.normalizePort(this.PORT);
            this.server.listen(port, () => {
                console.log(`Server process: ${process.pid} listening on port: ${port}`);
            });
        }
    }
}
exports.TicklesAdServer = TicklesAdServer;
