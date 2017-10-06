const mongoose = require('mongoose')
const Config = require('./config')

class Connection {

    connect () {
        mongoose.Promise = global.Promise
        mongoose.connect(Config.database.uri, { useMongoClient: true })
            .then(console.info(`Mongo is running`))
            .catch(err => console.error(`Mongo Error: ${err}`))
    }

}

module.exports = Connection