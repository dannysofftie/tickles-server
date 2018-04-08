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
        this.app.use('/', require('../routes'));
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
