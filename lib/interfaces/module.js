class ModuleInterface {

    inject () {
        return []
    }

    middlewares () {
        return []
    }

    children () {
        return []
    }

    validators () {
        return []
    }

    url () {
        return '/'
    }

}

module.exports = ModuleInterface