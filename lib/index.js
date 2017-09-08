const router = require('./router')
const connection = require('./connection')
const middleware = require('./middleware')
const configApp = require('../../../config/app')
const configDatabase = require('../../../config/database')
const configMiddleware = require('../../../config/middleware')
const configApi = require('../../../config/api')

const test1 = (req, res, next) => {
    console.log('test')

    next()
}

module.exports.bootstrap = express => {
    connection.init(configDatabase)
    express.use(`${configApi.url || '/api'}${configApi.version || '/v1'}`, middleware(configMiddleware))
    express.use(configApi.url || '/api', router(configApi.version))
    express.listen(configApp.port, console.info(`server runinng. Port: ${configApp.port}`))
}