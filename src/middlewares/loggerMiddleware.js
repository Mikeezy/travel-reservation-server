import logger from '../utils/logger.js'

export default function logErrorMiddleware(error, req, res, next) {

    if (typeof error.isLogged === 'undefined' || error.isLogged) {

        logger.error(`\nMessage : ${error.message || ''} \nCode : ${error.code || ''} \nStack : ${error.stack || ''}`)

    }

    next(error)

}