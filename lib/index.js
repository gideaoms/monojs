const _ = require('lodash')

module.exports = function (list) {
    _.map(list, value => {
        console.log(value)
    })
}