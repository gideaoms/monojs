const express = require('express')
const Utils = require('./utils')
const Params = require('./params')
const Middleware = require('./middleware')
const CustomValidator = require('./custom.validator')
const Router = require('./router')
const ModuleChildren = require('./module.children')

class Module {

    constructor () {
        this.server = express.Router()
    }

    configure (name) {
        const ClassModule = Utils.requireFile(name, 'module')
        if (!ClassModule) {
            throw new Error(`Module not found: ${name}`)
        }

        const module = new ClassModule

        const middleware = new Middleware()
        middleware.configure(module.middlewares())

        const customValidator = new CustomValidator
        customValidator.load(module.validators())

        const router = new Router
        router.configure(name)

        const children = new ModuleChildren
        children.configure(module.children())

        this.server.use(
            module.url(),
            Params.next(),
            middleware.next(),
            router.next(),
            children.next()
        )
    }

    next () {
        return this.server
    }

}

module.exports = Module