class Request {

    setRequest (request) {
        this.request = request
    }

    getRequest () {
        return this.request
    }

}

const request = new Request

module.exports = request

module.exports.Request = function () {
    return request.getRequest()
}
