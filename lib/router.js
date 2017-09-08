const fs = require('fs')
const express = require('express')
const router = express.Router()

const getFilesRouter = () => {
    const routersArray = []
    fs.readdirSync('./app/api').forEach(folder => {
        try { 
            routersArray.push({
                url: folder,
                router: require(`../../../app/api/${folder}/${folder}.router`),
                controller: require(`../../../app/api/${folder}/${folder}.controller`)
            })
        } catch (e) {
            throw new Error('Arquivo não encontrado. (monojs/router). ', e)
        }
    })
    return routersArray
}

const configure = (file, version) => {
    Object.keys(file.router).forEach(action => {
        const controller = new file.controller
        router[file.router[action].method](`${file.router[action].version || version}/${file.url}${file.router[action].path.replace('/', '')}`, (request, response) => controller[action](request, response))
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