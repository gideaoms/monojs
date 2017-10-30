const indicative = require('indicative')
const Utils = require('./utils')
const Inject = require('./inject')

class CustomValidator {

    constructor () {
        this.inject = new Inject
    }

    load (validators = []) {
        validators.forEach(validator => {
            const instanceValidator = this.inject.instance(`validators/${validator}`)
            if (typeof instanceValidator['name'] === 'undefined') {
                throw new Error('You need to define the validator name method')
            }
            indicative.extend(instanceValidator.name(), (data, field, message, args, get) => {
                return instanceValidator.validator(data, field, message, args, get)
            })
        })
    }

}

module.exports = CustomValidator
