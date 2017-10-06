module.exports = require('./monojs')
module.exports.Inject = new (require('./inject'))
module.exports.ModelMongo  = require('./model')
module.exports.Config = require('./config')
module.exports.Module = require('./module.implements')

const { Request } = require('./request')
const { Response } = require('./response')

module.exports.Request = Request
module.exports.Response = Response
