const init = middllewares => {
    const arrayMiddlewares = []
    Object.keys(middllewares).forEach(index => {
        middllewares[index].forEach(router => {
            try {
                const middlleware = require(`../../../app/middlewares/${index}`)
                arrayMiddlewares.push(middlleware)
            } catch (e) {}
        })
    })
    return arrayMiddlewares
}

module.exports.globalMiddleware = middllewares => {
    return init(middllewares)
}

module.exports.localMiddlleware = (Middleware, middlewaresFromUser) => {
    const middleware = new Middleware
    const localArrayMiddlewares = []
    middlewaresFromUser.forEach(action => {
        localArrayMiddlewares.push(middleware[action])
    })
    return localArrayMiddlewares
}