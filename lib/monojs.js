const express = require('express')
const Module = require('./module')
const Connection = require('./connection')

class MonoJS {

    constructor () {
        this.server = express.Router()
        this.connection = new Connection
        this.module = new Module
    }

    configure (moduleName) {
        this.connection.connect()
        this.module.configure(moduleName)
        this.server.use(
            this.module.next()
        )
    }

    next () {
        return this.server
    }

}

module.exports = function (moduleName) {
    const monojs = new MonoJS
    monojs.configure(moduleName)
    return monojs.next()
}