const express = require('express')
const Controller = require('./controller')
const Utils = require('./utils')
const Validator = require('./validator')
const Middleware = require('./middleware')

class Action {

    constructor () {
        this.server = express.Router()
    }

    next () {
        return this.server
    }

    configure (controller, route) {
        this.middleware = new Middleware
        this.middleware.configure(route.middleware)

        this.validator = new Validator
        this.validator.configure(controller, route.action)

        this.controller = new Controller
        this.controller.configure(controller, route.action)

        this.server
            .route(route.url)
            [route.method](
                this.middleware.next(),
                this.validator.next(),
                this.controller.next()
            )
    }

}

module.exports = Action