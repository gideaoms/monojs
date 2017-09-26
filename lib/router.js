const fs = require('fs')
const express = require('express')
const router = express.Router()

const getFilesRouter = () => {
    const routersArray = []
    fs.readdirSync('./app/api').forEach(folder => {
        let itemRouter = { url: folder }
        try {
            itemRouter.router = require(`../../../app/api/${folder}/${folder}.router`)
        } catch (e) {}
        try {
            itemRouter.controller = require(`../../../app/api/${folder}/${folder}.controller`)
        } catch (e) {}
        try {
            itemRouter.validator = require(`../../../app/api/${folder}/${folder}.validator`)
        } catch (e) {}
        routersArray.push(itemRouter)
    })
    return routersArray
}

const inject = (dependencies = []) => {
    const dependencyArray = []
    dependencies.forEach(dependency => {
        const resArray = dependency.split('.')
        try {
            const RequireDependency = require(`../../../app/api/${resArray[0]}/${resArray[0]}.${resArray[1]}`)
            if (typeof RequireDependency === 'function') {
                if (typeof RequireDependency['inject'] === 'function') {
                    dependencyArray.push(new (Function.prototype.bind.apply(RequireDependency, [null].concat(inject(RequireDependency['inject']()))))())
                } else {
                    dependencyArray.push(new RequireDependency)
                }
            } else {
                dependencyArray.push(RequireDependency)
            }
        } catch (e) {
            console.error('Dependency not found: ', e)
        }
    })
    return dependencyArray
}

const configure = (file, version) => {
    let controller = {}
    if (typeof file.controller.inject === 'function') {
        const dependencies = inject(file.controller.inject())
        controller = new (Function.prototype.bind.apply(file.controller, [null].concat(dependencies)))()
    } else {
        controller = new file.controller
    }
    Object.keys(file.router).forEach(action => {
        const middlewares = []
        if (file.validator) {
            middlewares.push(require('./validator').validator(file.validator, action))
        }
        if (file.router[action].middleware) {
            try {
                if (typeof file.router[action].middleware === 'string') {
                    middlewares.push(require(`../../../app/middlewares/${file.router[action].middleware}`))
                } else {
                    file.router[action].middleware.forEach(middleware => {
                        middlewares.push(require(`../../../app/middlewares/${middleware}`))
                    })
                }
            } catch (e) {}
        }
        router[file.router[action].method](`${file.router[action].version || version}/${file.url}/${file.router[action].path.replace('/', '')}`, middlewares, (request, response, next) => controller[action](request, response, next))
    })
}

const init = (version) => {
    getFilesRouter().forEach(file => {
        configure(file, version)
    })
}

module.exports = version => {
    init(version)
    return router
}
