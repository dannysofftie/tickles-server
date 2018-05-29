#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http_1 = require("http");
const os = require("os");
const cluster = require("cluster");
class TicklesAdServer {
    constructor() {
        this.PORT = process.env.PORT || 5000;
        this.CPUS = os.cpus().length;
        this.app = express();
        this.server = http_1.createServer(this.app);
        this.configs();
        this.routes();
    }
    configs() {
        this.app.disable('x-powered-by');
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(cors());
    }
    routes() {
        this.app.use('/advertiser', require('../routes/advertiser'));
        this.app.use('/publisher', require('../routes/publisher'));
        // any other get request
        this.app.get('*', (req, res) => {
            res.status(400).end(JSON.stringify({ error: 400, message: 'Bad request', info: 'Server only accepts requests from specific clients' }));
        });
        // any other post request
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
    startServer() {
        if (cluster.isMaster) {
            for (let i = 0; i < this.CPUS; i++) {
                cluster.fork();
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
