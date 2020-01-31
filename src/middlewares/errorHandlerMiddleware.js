import {
    PropertyInvalidWithMessageError,
    MyError
} from '../utils/customError.js'

export default function handleErrorMiddleware(error, req, res, next) {

    if (res.headersSent) {

        return next(error)
        
    }

    let dataToReturn = {
        success: false
    }

    if (error instanceof MyError) {

        dataToReturn.message = error.message
        dataToReturn.code = error.code ? error.code : 'ERROR'

    } else {

        dataToReturn.message = `Operation failure, it seems like something went wrong, please retry !`
        dataToReturn.code = 'ERROR'

    }

    if (error instanceof PropertyInvalidWithMessageError) {

        dataToReturn.property = error.property

    }

    return res.status(200).json(dataToReturn);

}