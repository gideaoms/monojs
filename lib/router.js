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
        try {
            itemRouter.middleware = require(`../../../app/api/${folder}/${folder}.middleware`)
        } catch (e) {}
        routersArray.push(itemRouter)
    })
    return routersArray
}

const configure = (file, version) => {
    const controller = new file.controller
    Object.keys(file.router).forEach(action => {
        const middlewares = []
        if (file.validator) {
            middlewares.push(require('./validator').validator(file.validator, action))
        }
        if (file.middleware) {
            const { localMiddlleware } = require('./middleware')
            if (file.router[action].middleware) {
                middlewares.push(localMiddlleware(file.middleware, file.router[action].middleware))
            }
        }        
        router[file.router[action].method](`${file.router[action].version || version}/${file.url}/${file.router[action].path.replace('/', '')}`, middlewares, (request, response) => controller[action](request, response))
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