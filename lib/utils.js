class Utils {

    static requireFile (module, type) {
        try {
            if (type) {
                return require(`../../../app/${module}.${type}`)
            }
            return require(`../../../app/${module}`)
        } catch (e) {
            return null
        }
    }

}

module.exports = Utils
