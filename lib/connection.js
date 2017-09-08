const mongoose = require('mongoose')
const fs = require('fs')

module.exports.init = connection => {
    mongoose.Promise = global.Promise
    mongoose.connect(connection.uri, { useMongoClient: true })
        .then(console.info(`Mongo is running`))
        .catch(err => console.error(`Mongo Error: ${err}`))
}

module.exports.load = () => {
    fs.readdirSync('./app/api').forEach(folder => {
        //mongoose.model(folder, mongoose.Schema(require(`../../../app/api/${folder}/${folder}.model`)(mongoose)))
        mongoose.model(folder, mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            initials: {
                type: String,
                unique: true,
                required: true
            }
        }))
    })
    // const model = require('../../../app/api/car/car.model')
    // console.log(model)
}