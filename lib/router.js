const express = require('express')
const Utils = require('./utils')
const Action = require('./action')

class Router {

    constructor () {
        this.server = express.Router()
    }

    next () {
        return this.server
    }

    configure (router) {
        const ClassRouter = Utils.requireFile(router, 'router')
        if (ClassRouter) {
            this.router = new ClassRouter
            this.router.routes().forEach(route => {
                this.action = new Action
                this.action.configure(router, route)
                this.server.use(this.action.next())
            })
        }
    }

}

module.exports = Router