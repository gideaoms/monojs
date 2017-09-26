const mongoose = require('mongoose')

const getInteger = number => {
    try {
        number = parseInt(number)
    } catch (e) {
        number = 1
    }
    return number
}

const plugin = function (schema, options) {
    schema.statics.paginate = function ({query = {}, page = 1, populate, select, sort, limit = 10}) {  
        page = getInteger(page)
        limit = getInteger(limit)

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

                            const lastPage = Math.ceil(count / limit)

                            resolve({
                                data: result,
                                total: count,
                                page,
                                perPage: limit,
                                lastPage
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
            this.boot(schema)
            mongoose.model(this.tableName(), schema)
        }
    }

    boot (schema) {
        /* tem que ter pra nao dar erro caso a classe filha nao implemente este metodo */
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
                    reject(err)
                })
        })
    }

    getObjectId () {
        return mongoose.Schema.Types.ObjectId
    }

    find (where) {
        return mongoose.models[this.tableName()].find(where)
    }

    findOne (query) {
        return new Promise((resolve, reject) => {
            mongoose.models[this.tableName()]
                .findOne(query)
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