const express = require('express')
const Params = require('./params')

class ModuleChildren {

    constructor () {
        this.server = express.Router()
    }

    configure (modules = []) {
        modules.forEach(nameModule => {
            const Module = require('./module')
            const module = new Module
            module.configure(nameModule)
            this.server.use(
                Params.next(),
                module.next()
            )
        })
    }

    next () {
        return this.server
    }

}

module.exports = ModuleChildren