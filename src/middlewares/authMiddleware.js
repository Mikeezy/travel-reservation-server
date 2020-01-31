import jwt from 'jsonwebtoken'
import {customError} from '../utils/customError.js'

const privateKey = process.env.TOKEN_PRIVATE_KEY

export default function (req, res, next) {

    let token = req.body.token || req.query.token || req.headers['authorization'];


    if (!token) {

        let error = new customError(`Token not provided, please authenticate yourself !`,'TOKEN_NOT_PROVIDED')
        next(error)

    } else {

        token = token.replace('Bearer ', '')

        jwt.verify(token, privateKey, function (error, decoded) {

            if (error) {

                if (error.name === 'TokenExpiredError') {

                    let error = new customError('Token expired, please retry or authenticate yourself !','TOKEN_EXPIRED')
                    next(error)

                } else if (error.name === 'JsonWebTokenError') {

                    let error = new customError('Invalid Token, please retry or authenticate yourself !','TOKEN_INVALID')
                    next(error)

                } else {

                    next(error)

                }

            }

            req.user = decoded;

            next();


        });
    }
}