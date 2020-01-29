import log from 'debug'
import moment from 'moment'
import('colors')

const debug = log('labbaik')

export function logErrorMiddleware(error, req, res, next) {

    debug(`${moment().format('DD/MM/YYYY HH:mm:ss')} : ${JSON.stringify(error)}`.red)
    next(error)

}

export function handleErrorMiddleware(error, req, res, next) {

    if (res.headersSent) {
        return next(error)
    }

    let dataToReturn = {
        success: false,
        code: error.code ? error.code : 'ERROR',
        message: error.show ? error.message : `Operation failure, it seems like something went wrong, please retry !`
    }

    if(error.meta) dataToReturn.meta = error.meta

    return res.status(200).json(dataToReturn);

}
