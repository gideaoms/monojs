class Response {

    setResponse (response) {
        this.response = response
    }

    getResponse () {
        return this.response
    }

}

const response = new Response

module.exports = response

module.exports.Response = function () {
    return response.getResponse()
}