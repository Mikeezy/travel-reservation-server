import {
    PropertyInvalidWithMessageError,
    handleError
} from '../utils/customError.js'

export default async function handleErrorMiddleware(error, req, res, next) {

    if (res.headersSent) {

        return next(error)

    }

    const isOperationalError = await handleError(error);

    if (!isOperationalError) {

        return next(error)

    } else {

        const dataToReturn = {
            success: false,
            message : error.message,
            code : error.code ? error.code : 'ERROR'
        }

        if (error instanceof PropertyInvalidWithMessageError) {

            dataToReturn.property = error.property

        }

        return res.status(200).json(dataToReturn)

    }


}