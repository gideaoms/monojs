const http = require('http')
const httpStatus = require('http-status')
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

        express.use(function (error, request, response, next) {
          if (error) {
            console.log(error)
            switch (error.code) {
              case 11000:
                response.status(httpStatus.BAD_REQUEST).json([{ message: 'Campo duplicado' }])
                break;
              default:
                const message = error.msg || 'Internal server error'
                response.status(httpStatus.INTERNAL_SERVER_ERROR).json([{ message }])
            }
          }
        })

        server = http.createServer(express)
        server.listen(configApp.port)

        server.on('listening', () => resolve(configApp.port))
        server.on('error', error => reject(error))
    })
}

module.exports.Model = require('./model')

module.exports.Config = require('./config')