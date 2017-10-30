const mongoose = require('mongoose')
const Model = require('../model.mongo')

class ModelMongoInterface {

    constructor () {
        this.model = new Model(this.tableName(), this.attributes(), this.apply)
    }

    apply (schema) {}

    getObjectId () {
        return mongoose.Schema.Types.ObjectId
    }

    paginate (params) {
        return this.model.paginate(params)
    }

    find (where) {
        return this.model.find(where)
    }

    findById (id) {
        return this.model.findById(id)
    }

    findOne (query) {
        return this.model.findOne(query)
    }

    create (data) {
        return this.model.create(data)
    }

    insertMany (data) {
        return this.model.insertMany(data)
    }

    update (id, data) {
        return this.model.findOneAndUpdate(id, data)
    }

    remove (id) {
        return this.model.findOneAndRemove(id)
    }

}

module.exports = ModelMongoInterface
