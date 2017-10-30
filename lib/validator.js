const express = require('express')
const indicative = require('indicative')
const httpStatus = require('http-status')
const Utils = require('./utils')
const Params = require('./params')

class Validator {

    constructor () {
        this.server = express.Router()
    }

    next () {
        return this.server
    }

    configure (validator, action) {
        const ClassValidator = Utils.requireFile(validator, 'validator')
        if (!ClassValidator) {
            return null
        }
        this.server.use(
            Params.next(),
            (request, response, next) => {
                request.params = Params.getParams()

                this.validator = new ClassValidator

                if (typeof this.validator.fillable !== 'function') {
                    throw new Error(`Implements the fillable method in the class ${validator}.validator`)
                }

                if (typeof this.validator[action] === 'function') {
                    const rules = this.validator[action] ? this.validator[action](request) : {}
                    const messages = this.validator['messages'] ? this.validator['messages']() : {}
                    const data = {
                        body: request.body,
                        query: request.query,
                        params: request.params,
                        files: request.files
                    }

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
                        .catch(e => response.status(httpStatus.BAD_REQUEST).json(e))
                }
                next()
            }
        )
    }

}

module.exports = Validator
