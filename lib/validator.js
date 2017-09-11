const indicative = require('indicative')
const httpStatus = require('http-status')

module.exports = (Validator, action) => {
    return function (request, response, next) {
        const validator = new Validator
        const rules = validator[action] ? validator[action]() : {}
        const messages = validator['messages'] ? validator['messages']() : {}
        const data = Object.assign(request.body, request.params)

        indicative
            .validateAll(data, rules, messages)
            .then(function () {
                try {
                    const data = {}
                    validator.fillable().forEach(field => {
                        data[field] = request.body[field]
                    })
                    request.body = data
                    next()
                } catch (e) {
                    throw new Error('Implemente o metodo fillable')
                }
            })
            .catch(function (e) {
                response.status(httpStatus.BAD_REQUEST).json(e)
            })
    }
}