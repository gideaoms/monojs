const express = require('express')
const Utils = require('./utils')
const Inject = require('./inject')

class Middleware {

    constructor () {
        this.server = express.Router()
        this.inject = new Inject
    }

    next () {
        return this.server
    }

    configure (middlewares = []) {
        if (typeof middlewares === 'string') {
            return this.server.use((request, response, next) => {
                this.middlewareLocal = this.inject.instance(`middlewares/${middlewares}`)
                this.middlewareLocal.middleware(request, response, next)
            })
        }
        middlewares.forEach(middleware => {
            this.server.use((request, response, next) => {
                this.middleware = this.inject.instance(`middlewares/${middleware}`)
                this.middleware.middleware(request, response, next)
            })
        })
    }

}

module.exports = Middleware