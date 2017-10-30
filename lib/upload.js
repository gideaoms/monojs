const express = require('express')
const multer = require('multer')
const uniqueFilename = require('unique-filename')
const mimeTypes = require('mime-types')
const Config = require('./config')

class Upload {

    constructor () {
        this.server = express.Router()
    }

    configure () {
        const storage = multer.diskStorage({
            destination: (request, file, callback) => {
                callback(null, './')
            },
            filename: (request, file, callback) => {
                const date = new Date()
                const nameFile = uniqueFilename(`${Config.upload.folder}/${Config.upload.temp}`, date.getTime())
                const extension = mimeTypes.extension(file.mimetype)
                callback(null, `${nameFile}.${extension}`)
            }
        })
        const upload = multer({ storage })
        this.server.use(
            (request, response, next) => {
                const file = upload.any()
                file(request, response, error => {
                    if (!error) {
                        const files = {}
                        const folder = Config.upload && Config.upload.folder ? Config.upload.folder : ''
                        request.files.forEach(file => {
                            files[file.fieldname] = {
                                filename: file.path.split('/').pop(),
                                path: file.path.replace(`${folder}/`, ''),
                                size: file.size,
                                extension: mimeTypes.extension(file.mimetype)
                            }
                        })
                        request.files = files
                    }
                    next()
                })
            }
        )
    }

    next () {
        return this.server
    }

}

module.exports = Upload
