const indicative = require('indicative')
const Utils = require('./utils')

class CustomValidator {

    load (validators) {
        validators.forEach(validator => {
            const validatorRequired = Utils.requireFile(`validators/${validator}`)
            indicative.extend(Utils.removeExtension(validator), validatorRequired)
        })
    }

}

module.exports = CustomValidator