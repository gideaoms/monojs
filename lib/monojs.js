const express = require('express')
const Module = require('./module')
const Connection = require('./connection')

class MonoJS {

    constructor () {
        this.server = express.Router()
        this.module = new Module
        this.connection = new Connection
    }

    next () {
        return this.server
    }

    configure (module) {
        this.connection.connect()
        this.module.configure(module)
        this.server.use(this.module.next())
    }

}

module.exports = function (module) {
    const monojs = new MonoJS()
    monojs.configure(module)
    return monojs.next()
}