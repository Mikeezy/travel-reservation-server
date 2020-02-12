const validator = require('express-validator')
const {PropertyInvalidWithMessageError} = require('../utils/customError')

module.exports = function (req,res,next){

    const errors = validator.validationResult(req);

    if (errors.isEmpty()) {

        return next();
        
    }

    const field = errors.array()[0]
    const error = new PropertyInvalidWithMessageError(field.param,field.msg)
    next(error)

}