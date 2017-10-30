const express = require('express')
const Inject = require('./inject')
const Params = require('./params')
const Request = require('./request')
const Response = require('./response')

class Controller {

    constructor () {
        this.server = express.Router()
        this.inject = new Inject
    }

    configure (name, action) {
        this.server.use(
            Params.next(),
            (request, response, next) => {
                request.params = Params.getParams()

                Request.setRequest(request)
                Response.setResponse(response)

                const controller = this.inject.instance(`${name}.controller`)
                controller[action](request, response, next)
            }
        )
    }

    next () {
        return this.server
    }

}

module.exports = Controller
