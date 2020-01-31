import validator from 'express-validator'
import {PropertyInvalidWithMessageError} from '../utils/customError.js'

export default function (req,res,next){

    const errors = validator.validationResult(req);

    if (errors.isEmpty()) {

        return next();
        
    }

    const field = errors.array()[0]
    const error = new PropertyInvalidWithMessageError(field.param,field.msg)
    next(error)

}