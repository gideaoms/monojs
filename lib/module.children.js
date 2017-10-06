const express = require('express')

class ModuleChildren {

    constructor () {
        this.server = express.Router()
    }

    next () {
        return this.server
    }

    configure (childrenModules, Module) {
        childrenModules.forEach(module => {
            this.module = new Module
            this.module.configure(module)
            this.server.use(this.module.next())
        })
    }

}

module.exports = ModuleChildren