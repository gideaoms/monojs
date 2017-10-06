const express = require('express')
const indicative = require('indicative')
const httpStatus = require('http-status')
const Utils = require('./utils')

class Validator {

    constructor () {
        this.server = express.Router()
    }

    next () {
        return this.server
    }

    configure (validator, action) {
        const ClassValidator = Utils.requireFile(validator, 'validator')
        this.server.use((request, response, next) => {
            this.validator = new ClassValidator

            if (typeof this.validator.fillable !== 'function') {
                throw new Error(`Implements the fillable method in the class ${validator}.validator`)
            }

            if (typeof this.validator[action] === 'function') {
                const rules = this.validator[action] ? this.validator[action](request) : {}
                const messages = this.validator['message'] ? this.validator['message']() : {}
                const data = Object.assign(request.body, request.query, request.params)

                return indicative
                    .validateAll(data, rules, messages)
                    .then(() => {
                        const data = {}
                        this.validator.fillable().forEach(field => {
                            if (request.body[field] && typeof request.body[field] !== 'undefined') {
                                data[field] = request.body[field]
                            }
                        })
                        request.body = data
                        next()
                    })
                    .catch(function (e) {
                        response.status(httpStatus.BAD_REQUEST).json(e)
                    })
            }
            next()
        })
    }

}

module.exports = Validator