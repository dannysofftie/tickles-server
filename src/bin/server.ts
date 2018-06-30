#!/usr/bin/env node

import * as bodyParser from 'body-parser';
import * as cluster from 'cluster';
import * as cors from 'cors';
import * as express from 'express';
import { createServer, Server } from 'http';
import * as os from 'os';
import * as mongoose from 'mongoose'

export class TicklesAdServer {
    private app: express.Application
    private server: Server
    private PORT: number | string
    private MONGO_URI: string
    private ENV_CPUS: number

    constructor() {
        this.PORT = process.env.PORT || 5000
        this.app = express()
        this.server = createServer(this.app)
        this.ENV_CPUS = process.env.NODE_ENV === 'production' ? os.cpus().length : 1
        this.MONGO_URI = process.env.NODE_ENV === 'production' ? 'mongodb+srv://dannysofftie:25812345Dan@project-adexchange-bftmj.gcp.mongodb.net/test?retryWrites=true' : 'mongodb://127.0.0.1/project-adexchange'
        this.configs()
        this.routes()
    }

    private configs() {
        this.app.disable('x-powered-by')
        this.app.use(bodyParser.urlencoded({ extended: true }))
        this.app.use(bodyParser.json())
        this.app.use(cors())
        this.app.use((req, res, next) => {
            res.setHeader('X-Powered-By', 'Go-langV1.10.3')
            next()
        })
        mongoose.connect(this.MONGO_URI)
    }
    private routes() {
        // handle authentication requests
        this.app.use('/api/v1/auth', require('../routes/auth-routes'))
        // handle data requests
        this.app.use('/api/v1/data', require('../routes/data-routes'))
        // handle requests to publisher content, including serving ads to publisher websites and other online apps
        this.app.use('/api/v1/pub-content', require('../routes/pub-routes'))
        // handle ad views, impressions and clicks
        this.app.use('/api/v1/cnb', require('../routes/ads-routes'))
        // handle ad and campaign publishing
        this.app.use('/api/v1/publish', require('../routes/publish-ads-routes'))
        // fallback for unhandled get requests
        this.app.get('*', (req, res) => {
            res.status(400).end(JSON.stringify({ error: 400, message: 'Bad request', info: 'Server only accepts requests from specific clients' }))
        })
        // fallback for unhandled post requests
        this.app.post('*', (req, res) => {
            res.status(400).end(JSON.stringify({ error: 400, message: 'Bad request', info: 'Invalid endpoint' }))
        })
    }
    private normalizePort(port: string | number) {
        if (typeof port == 'function') {
            throw new TypeError('Argument of type function can\'t used as port')
        } else if (typeof port == 'string') {
            return Number.isNaN(parseInt(port)) ? process.exit(1) : parseInt(port)
        } else if (typeof port == 'undefined') {
            throw new Error('Expected parameter port number but found none')
        } else if (typeof port == 'object') {
            throw new TypeError('Argument of type object can\'t be used as port')
        } else if (isNaN(port)) {
            return 4000
        }
        return port
    }
    public async startServer() {
        if (cluster.isMaster) {
            for (let i = 0; i < this.ENV_CPUS; i++) {
                cluster.fork()
            }
            for await (const event of ['disconnect', 'exit'])
                cluster.on(event, () => cluster.fork())
        } else {
            let port = this.normalizePort(this.PORT)
            this.server.listen(port, () => {
                console.log(`Server process: ${process.pid} listening on port: ${port}`)
            })
        }
    }
}