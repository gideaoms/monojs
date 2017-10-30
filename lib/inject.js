const Utils = require('./utils')

class Inject {

    get (dependencies = []) {
        if (typeof dependencies === 'string') {
            return this.addDependency(dependencies)
        } else {
            const dependenciesToInject = []
            dependencies.forEach(dependency => {
                dependenciesToInject.push(this.addDependency(dependency))
            })
            return dependenciesToInject
        }
    }

    addDependency (dependency) {
        const ClassDependency = Utils.requireFile(dependency)
        if (typeof ClassDependency === 'function') {
            if (typeof ClassDependency['inject'] === 'function') {
                return (new (Function.prototype.bind.apply(ClassDependency, [null].concat(this.get(ClassDependency['inject']()))))())
            } else {
                return (new ClassDependency)
            }
        } else {
            return (ClassDependency)
        }
    }

    instance (path) {
        const ClassInstance = Utils.requireFile(path)
        if (!ClassInstance) {
            throw new Error(`File is not found: ${path}`)
        }
        if (typeof ClassInstance.inject === 'function') {
            const dependencies = this.get(ClassInstance.inject())
            return new (Function.prototype.bind.apply(ClassInstance, [null].concat(dependencies)))()
        } else {
            return new ClassInstance
        }
    }

}

module.exports = Inject
