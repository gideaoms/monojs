const mongoose = require('mongoose')

class Model {

    constructor (tableName, attributes, callback = () => {}) {
        this.tableName = tableName
        this.attributes = attributes
        this.callback = callback
        if (!mongoose.models[this.tableName]) {
            const schema = new mongoose.Schema(this.attributes)
            schema.plugin(this.plugin)
            this.apply(schema)
            mongoose.model(this.tableName, schema)
        }
        return mongoose.models[this.tableName]
    }

    apply (schema) {
        this.callback(schema)
    }

    plugin (schema, options) {
        schema.statics.paginate = function ({query = {}, page = +1, populate, select, sort, limit = +10}) {
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
                                    total: +count,
                                    page: +page,
                                    perPage: +limit,
                                    lastPage: +lastPage
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

}

module.exports = Model
