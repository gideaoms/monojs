const express = require('express')
const router = express.Router()

const init = middllewares => {
    Object.keys(middllewares).forEach(index => {
            try {
                const middlleware = require(`../../../app/middlewares/${index}`)
                if (typeof middllewares[index] === 'object') {
                    middllewares[index].forEach(url => {
                        router.use(`/*/${url}`, middlleware)
                    })
                } else if (middllewares[index] === '*') {     
                    router.use(middlleware)
                }
            } catch (e) {}
    })
    return router
}

module.exports.globalMiddleware = middllewares => {
    return init(middllewares)
}