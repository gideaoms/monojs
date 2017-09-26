const fs = require('fs')

const config = {}

fs.readdirSync('./config').forEach(file => {
    const reqFile = require(`../../../config/${file}`)
    if (typeof reqFile === 'object') {
        file = file.replace('.js', '')
        config[file] = reqFile
    }
})

module.exports = config