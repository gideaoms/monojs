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
            indicative.extend(Utils.removeExtension(validator), (data, field, message, args, get) => {
                return instanceValidator.validator(data, field, message, args, get)
            })
        })
    }

}

module.exports = CustomValidator
