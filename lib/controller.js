const express = require('express')
const Inject = require('./inject')
const Request = require('./request')
const Response = require('./response')

class Controller {

    constructor () {
        this.server = express.Router()
        this.inject = new Inject
    }

    next () {
        return this.server
    }

    configure (controller, action) {
        this.server.use((request, response, next) => {
            Request.setRequest(request)
            Response.setResponse(response)

            this.controller = this.inject.instance(`${controller}.controller`)
            this.controller[action](request, response, next)
        })
    }

}

module.exports = Controller