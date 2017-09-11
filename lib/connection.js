const mongoose = require('mongoose')
const fs = require('fs')

module.exports.init = connection => {
    mongoose.Promise = global.Promise
    mongoose.connect(connection.uri, { useMongoClient: true })
        .then(console.info(`Mongo is running`))
        .catch(err => console.error(`Mongo Error: ${err}`))
}