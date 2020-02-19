const jwt = require('jsonwebtoken')
const {customError} = require('../utils/customError')
const config = require('config')

const privateKey = config.get('TOKEN_PRIVATE_KEY')

module.exports = function (req, res, next) {

    let token = req.body.token || req.query.token || req.headers['authorization'];

    console.log(req.body)
    if (!token) {

        let error = new customError(`Token non fourni, veuillez vous authentifier svp !`,'TOKEN_NOT_PROVIDED')
        next(error)

    } else {

        token = token.replace('Bearer ', '')

        jwt.verify(token, privateKey, function (error, decoded) {

            if (error) {

                if (error.name === 'TokenExpiredError') {

                    let error = new customError('Token expiré, veuillez réessayer ou veuillez vous authentifier svp !','TOKEN_EXPIRED')
                    next(error)

                } else if (error.name === 'JsonWebTokenError') {

                    let error = new customError('Token invalide, veuillez réessayer ou veuillez vous authentifier svp !','TOKEN_INVALID')
                    next(error)

                } else {

                    next(error)

                }

            }

            res.locals.user = decoded;

            next();


        });
    }
}