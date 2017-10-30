const express = require('express')
const Middleware = require('./middleware')
const Params = require('./params')
const Validator = require('./validator')
const Controller = require('./controller')

class Action {

    constructor () {
        this.server = express.Router()
    }

    configure (name, route) {
        const middleware = new Middleware
        middleware.configure(route.middleware)

        const validator = new Validator
        validator.configure(name, route.action)

        const controller = new Controller
        controller.configure(name, route.action)

        this.server
            .route(route.url)[route.method](
                Params.next(),
                middleware.next(),
                validator.next(),
                controller.next()
            )
    }

    next () {
        return this.server
    }

}

module.exports = Action