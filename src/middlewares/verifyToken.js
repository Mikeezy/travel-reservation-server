import jwt from 'jsonwebtoken'

const privateKey = process.env.TOKEN_PRIVATE_KEY

export default function (req, res, next) {

    let token = req.body.token || req.query.token || req.headers['authorization'];


    if (!token) {

        let dataToReturn = {
            show: true,
            code: 'TOKEN_NOT_PROVIDED',
            message: `Token not provided, please authenticate yourself !`
        }

        next(dataToReturn)

    } else {

        token = token.replace('Bearer ', '')

        jwt.verify(token, privateKey, function (error, decoded) {

            if (error) {

                if (error.name === 'TokenExpiredError') {

                    let dataToReturn = {
                        show: true,
                        code: 'TOKEN_EXPIRED',
                        message: 'Token expired, please retry or authenticate yourself !'
                    }

                    next(dataToReturn)

                } else if (error.name === 'JsonWebTokenError') {

                    let dataToReturn = {
                        show: true,
                        code: 'TOKEN_INVALID',
                        message: 'Invalid Token, please retry or authenticate yourself !'
                    }

                    next(dataToReturn)

                } else {

                    next(error)

                }

            }

            req.user = decoded;

            next();


        });
    }
}