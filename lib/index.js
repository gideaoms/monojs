module.exports = require('./monojs')
module.exports.Inject = new (require('./inject'))
module.exports.Config = require('./config')
module.exports.Module = require('./interfaces/module')
module.exports.ModelMongo = require('./interfaces/model.mongo')

const { Request } = require('./request')
const { Response } = require('./response')

module.exports.Request = Request
module.exports.Response = Response