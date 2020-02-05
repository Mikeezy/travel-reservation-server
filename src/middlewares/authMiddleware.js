import jwt from 'jsonwebtoken'
import {customError} from '../utils/customError.js'
import config from 'config'

const privateKey = config.get('TOKEN_PRIVATE_KEY')

export default function (req, res, next) {

    let token = req.body.token || req.query.token || req.headers['authorization'];


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