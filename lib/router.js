const express = require('express')
const Utils = require('./utils')
const Action = require('./action')
const Params = require('./params')

class Router {

    constructor () {
        this.server = express.Router()
    }

    configure (name) {
        const ClassRouter = Utils.requireFile(name, 'router')
        if (ClassRouter) {
            const router = new ClassRouter
            router.routes().forEach(route => {
                const action = new Action
                action.configure(name, route)
                this.server.use(
                    Params.next(),
                    action.next()
                )
            })
        }
    }

    next () {
        return this.server
    }

}

module.exports = Router