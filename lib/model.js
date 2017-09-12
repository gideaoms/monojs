const mongoose = require('mongoose')

const plugin = function (schema, options) {
    schema.statics.paginate = function ({query = {}, page, populate, select, sort, limit}) {        
        try { limit = parseInt(limit) } catch(e) { limit = 10 }
        try { page = parseInt(page) } catch (e) { page = 1 }
        const concatQuery = this.find(query)
            .skip((page - 1) * limit)
            .limit(limit)

        const queryCount = this.count(query)

        if (select) {
            concatQuery.select(select)
        }
        if (populate) {
            concatQuery.populate(populate)
        }
        if (sort) {
            concatQuery.sort(sort)
        } else {
            concatQuery.sort({_id: -1})
        }

        return new Promise(function (resolve, reject) {
            concatQuery
                .exec()
                .then(result => {
                    queryCount
                        .exec()
                        .then(count => {
                            resolve({
                                data: result,
                                total: count
                            })
                        })
                        .catch(reject)
                })
                .catch(reject)
        })
    }

    schema.pre('findOneAndUpdate', function(next) {
        this.options.new = true
        this.options.runValidators = true
        next()
    })
}

class Model {

    constructor () {
        if (!mongoose.models[this.tableName()]) {
            const schema = mongoose.Schema(this.attributes())
            schema.plugin(plugin, {doc: this.tableName()})
            mongoose.model(this.tableName(), schema)
        }
    }

    paginate (params) {
        return new Promise((resolve, reject) => {
            mongoose.models[this.tableName()]
                .paginate(params)
                .then(result => {
                    if (result) {
                        return resolve(result)
                    }
                    reject(null)
                })
                .catch(err => {
                    console.log(err)
                    reject(err)
                })
        })
    }

    find (where) {
        return new Promise((resolve, reject) => {
            mongoose.models[this.tableName()]
                .find(where)
                .then(result => {
                    if (result) {
                        return resolve(result)
                    }
                    reject(null)
                })
                .catch(err => reject(err))
        })
    }

    findOne (id) {
        return new Promise((resolve, reject) => {
            mongoose.models[this.tableName()]
                .findOne(id)
                .then(result => {
                    if (result) {
                        return resolve(result)
                    }
                    reject(null)
                })
                .catch(err => reject(err))
        })
    }

    create (data) {
        return new Promise((resolve, reject) => {
            mongoose.models[this.tableName()]
                .create(data)
                .then(result => {
                    resolve(result)
                })
                .catch(err => reject(err))
        })
    }

    findOneAndUpdate (id, data) {
        return new Promise((resolve, reject) => {
            mongoose.models[this.tableName()]
                .findOneAndUpdate(id, data)
                .then(result => {
                    if (result) {
                        return resolve(result)
                    }
                    reject(null)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    findOneAndRemove (id) {
        return new Promise((resolve, reject) => {
            mongoose.models[this.tableName()]
                .findOneAndRemove(id)
                .then(result => {
                    if (result) {
                        return resolve(result)
                    }
                    reject(null)
                })
                .catch(err => reject(err))
        })
    }

}

module.exports = Model