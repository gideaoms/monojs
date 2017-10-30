const express = require('express')
const Inject = require('./inject')
const Params = require('./params')

class Middleware {

    constructor () {
        this.server = express.Router()
        this.inject = new Inject
    }

    configure (middlewares = []) {
        if (typeof middlewares === 'string') {
            middlewares = [middlewares]
        }
        middlewares.forEach(middleware => {
            switch (middleware) {
                case 'monojs.upload':
                    const ClassMiddlewareUpload = require('./upload')
                    const middlewareUpload = new ClassMiddlewareUpload
                    middlewareUpload.configure()
                    this.server.use(
                        middlewareUpload.next()
                    )
                    break
                default:
                    this.server.use(
                        Params.next(),
                        (request, response, next) => {
                            request.params = Params.getParams()
                            const instanceMiddleware = this.inject.instance(`middlewares/${middleware}`)
                            instanceMiddleware.middleware(request, response, next)
                        }
                    )
            }
        })
    }

    next () {
        return this.server
    }

}

module.exports = Middleware
