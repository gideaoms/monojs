const express = require('express')
const Utils = require('./utils')
const ModuleChildren = require('./module.children')
const Router = require('./router')
const Middleware = require('./middleware')
const CustomValidator = require('./custom.validator')

class Module {

    constructor () {
        this.server = express.Router()
    }

    next () {
        return this.server
    }

    configure (module) {
        const ClassModule = Utils.requireFile(module, 'module')
        this.module = new ClassModule

        this.middleware = new Middleware
        this.middleware.configure(this.module.middlewares())

        this.customValidator = new CustomValidator
        this.customValidator.load(this.module.customValidators())

        this.moduleChildren = new ModuleChildren
        this.moduleChildren.configure(this.module.childrenModules(), Module)

        this.router = new Router
        this.router.configure(module)

        this.server.use(
            this.module.url(),
            this.middleware.next(),
            this.moduleChildren.next(),
            this.router.next()
        )
    }

    hasNextModule () {
        return this.module.nextModule()
    }

}

module.exports = (new (function () {
    return Module
})())