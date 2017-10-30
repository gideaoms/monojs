class Params {

    constructor () {
        this.params = {}
    }

    addParams (params) {
        for (let param in params) {
            this.params[param] = params[param]
        }
    }

    getParams () {
        return this.params
    }

    next () {
        return (request, response, next) => {
            this.addParams(request.params)
            next()
        }
    }

}

module.exports = new Params