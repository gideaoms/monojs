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

module.exports = middllewares => {
    return init(middllewares)
}