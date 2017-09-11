const http = require('http')
const router = require('./router')
const connection = require('./connection')
const { globalMiddleware } = require('./middleware')
const { loadCustomValidators } = require('./validator')
const configApp = require('../../../config/app')
const configDatabase = require('../../../config/database')
const configMiddleware = require('../../../config/middleware')
const configApi = require('../../../config/api')

const getUrlBase = function (configApi) {
    return configApi.url || '/api'
}

module.exports.bootstrap = express => {
    return new Promise(function(resolve, reject) {
        connection.init(configDatabase)
        loadCustomValidators()

        express.use(getUrlBase(configApi), globalMiddleware(configMiddleware))
        express.use(getUrlBase(configApi), router(configApi.version))

        server = http.createServer(express)
        server.listen(configApp.port)

        server.on('listening', () => resolve(configApp.port))
        server.on('error', error => reject(error))
    })
}