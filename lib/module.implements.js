const mongoose = require('mongoose')

class ModuleImplements {

    inject () {
        return []
    }

    middlewares () {
        return []
    }

    childrenModules () {
        return []
    }

    customValidators () {
        return []
    }

    url () {
        return '/'
    }

}

module.exports = ModuleImplements