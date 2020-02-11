import User from './model.js'
import {
    generateUuid
} from '../../utils/random.js'
import Promise from 'bluebird'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import emailController from '../../email/controller.js'
import {
    customError,
    customSimpleError
} from '../../utils/customError.js'
import config from 'config'

const saltRound = 10;
const privateKey = config.get('TOKEN_PRIVATE_KEY')
const tokenExpiry24h = config.get('TOKEN_EXPIRE_USER')
const tokenExpiry1h = config.get('TOKEN_EXPIRE_IN_SHORT')



export async function getAll() {

    let data = await User.find({})
        .select('-uuid -driver -bookings')
        .sort('lastname')
        .exec()

    return data
}

export async function block({
    id
}) {

    let userGet = await User.findOne({
        _id: id
    }).select('_id blocked').exec()

    if (userGet) {

        userGet.blocked = userGet.blocked === true ? false : true

        await userGet.save()
    }

    return null

}

export async function updateProfile({
    user,
    ...data
}) {

    let userUpdated = await User.findOneAndUpdate({
        _id: user._id
    }, data, {
        new: true
    }).select('-uuid -driver -bookings').exec()

    return userUpdated

}


export async function updatePassword({
    password,
    old_password,
    user
}) {

    let userGet = await User.findOne({
        _id: user._id
    }).exec()

    let response = await bcrypt.compare(old_password, userGet.password)

    if (!response) {

        throw new customError('Password incorrect, please retry !')

    }

    let hash = await bcrypt.hash(password, saltRound)

    await User.findOneAndUpdate({
        _id: user._id
    }, {
        password: hash
    }).exec()

    return null

}

// Auth methods
export async function auth({
    email,
    password,
    expiresIn = tokenExpiry24h
}) {

    let userGet = await User.findOne({
        email
    }).select('-uuid -driver -bookings').exec()

    if (userGet) {

        let response = await bcrypt.compare(password, userGet.password)

        if (response === true) {

            const jwtSignAsync = Promise.promisify(jwt.sign)

            const token = await jwtSignAsync(JSON.parse(JSON.stringify(userGet)), privateKey, {
                expiresIn
            })

            userGet = userGet.toObject()
            userGet.token = token

            return userGet

        } else {

            throw new customError('Email ou mot de passe incorrect, veuillez réessayer svp !', 'AUTHENTICATION_ERROR')

        }

    } else {

        throw new customError('Email ou mot de passe incorrect, veuillez réessayer svp !', 'AUTHENTICATION_ERROR')

    }


}

export async function signupAdminPartOne(data) {

    jwt.sign(data, privateKey, {
        expiresIn: tokenExpiry1h
    }, async (error, token) => {

        if (error) throw error

        let emailInfo = await emailController.sendConfirmationMail({
            to: data.email,
            info: {
                link: `${config.get('HOSTNAME_FRONTEND')}${config.get('LINK_CONFIRMATION_FRONTEND')}/${token}`
            }
        })

        if (emailInfo) {

            return null

        } else {

            throw new customSimpleError()

        }

    })

}

export async function signupAdminPartTwo(data) {

    let uuidPromise = generateUuid(User, 'uuid')
    let passwordHashPromise = bcrypt.hash(data.password, saltRound)

    let [uuid, passwordHash] = await Promise.all([uuidPromise, passwordHashPromise])

    delete data.confirm_password
    data.password = passwordHash
    data.uuid = uuid
    data.status = true

    let userCreated = await new User(data).save()

    await emailController.sendAfterRegisterMail({
        to: userCreated.email,
        info: {
            email: userCreated.email
        }
    })

    return null

}

export async function checkToken({
    token
}) {

    const jwtVerifyAsync = Promise.promisify(jwt.verify)

    try {
    
        const decoded = await jwtVerifyAsync(token, privateKey)

        return decoded

    } catch (error) {
    
        if (error.name === 'TokenExpiredError') {

            throw new customError('La validité du token a expiré, veuillez recommencer le processus svp !', 'TOKEN_EXPIRED')

        } else if (error.name === 'JsonWebTokenError') {

            throw new customError('Le token est invalide, veuillez réessayer svp !', 'TOKEN_INVALID')

        } else {

            throw error

        }

    }
    
}

export async function resetPasswordPartOne({
    email
}) {

    let userGet = await User.findOne({
        email
    }).exec()

    jwt.sign({
        _id: userGet._id,
        email: userGet.email
    }, privateKey, {
        expiresIn: tokenExpiry1h
    }, async (error, token) => {

        if (error) throw error

        let emailInfo = await emailController.sendResetPasswordMail({
            to: userGet.email,
            info: {
                link: `${config.get('HOSTNAME_FRONTEND')}${config.get('LINK_RESET_PASSWORD_FRONTEND')}/${token}`
            }
        })

        if (emailInfo) {

            return null

        } else {

            throw new customSimpleError()

        }

    })

}

export async function resetPasswordPartTwo({
    token
}) {

    try {

        await checkToken({
            token
        })

        let dataToReturn = {
            token
        }

        return dataToReturn

    } catch (error) {

        if (error.code === 'TOKEN_EXPIRED') {

            throw new customError('The validity of the link has expired, please repeat the process !', error.code)

        } else if (error.code === 'TOKEN_INVALID') {

            throw new customError('This link is incorrect, please repeat the process !', error.code)

        } else {

            throw error

        }

    }

}

export async function resetPasswordPartThree({
    token,
    password
}) {

    try {

        let decodedPromise = checkToken({
            token
        })

        let hashPromise = bcrypt.hash(password, saltRound)

        let [decoded, hash] = await Promise.all([decodedPromise, hashPromise])

        await User.findOneAndUpdate({
            _id: decoded._id
        }, {
            password: hash
        }).exec()

        return null

    } catch (error) {

        if (error.code === 'TOKEN_EXPIRED') {

            throw new customError('The validity of the link has expired, please repeat the process !', error.code)

        } else if (error.code === 'TOKEN_INVALID') {

            throw new customError('This link is incorrect, please repeat the process !', error.code)

        } else {

            throw error

        }

    }

}