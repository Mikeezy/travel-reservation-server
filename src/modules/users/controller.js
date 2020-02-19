const User = require('./model.js')
const {
    generateUuid
} = require('../../utils/random')
const Promise = require('bluebird')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const emailController = require('../../email/controller')
const {
    customError,
    customSimpleError
} = require('../../utils/customError')
const config = require('config')

const saltRound = 10;
const privateKey = config.get('TOKEN_PRIVATE_KEY')
const tokenExpiry24h = config.get('TOKEN_EXPIRE_USER')
const tokenExpiry1h = config.get('TOKEN_EXPIRE_IN_SHORT')



exports.getAll = async function getAll({
    offset = 0,
    limit = 5
}) {

    const dataPromise = await User.find({
            status : true,
            role: {
                $ne: "super admin"
            }
        })
        .skip(+offset)
        .limit(+limit)
        .select('-uuid -driver -bookings')
        .sort('lastname')
        .exec()

    const totalPromise = User.find()
        .countDocuments()
        .exec()

    const [data, total] = await Promise.all([dataPromise, totalPromise])

    return {
        total,
        data
    }
}

exports.block = async function block({
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

exports.updateProfile = async function updateProfile({
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


exports.updatePassword = async function updatePassword({
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
exports.auth = async function auth({
    email,
    password,
    expiresIn
}) {

    let userGet = await User.findOne({
        email
    }).select('-uuid -driver -bookings').exec()

    if (userGet) {

        let response = await bcrypt.compare(password, userGet.password)

        if (response === true) {

            const jwtSignAsync = Promise.promisify(jwt.sign)

            let token

            if (expiresIn) {

                token = await jwtSignAsync(userGet.toObject(), privateKey, {
                    expiresIn: tokenExpiry24h
                })
            } else {

                token = await jwtSignAsync(userGet.toObject(), privateKey)

            }

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

exports.signupAdminPartOne = async function signupAdminPartOne(data) {

    const jwtSignAsync = Promise.promisify(jwt.sign)

    const token = await jwtSignAsync(data, privateKey, {
        expiresIn: tokenExpiry1h
    })

    let emailInfo = await emailController.sendConfirmationMail({
        to: data.email,
        info: {
            link: `${config.get('HOSTNAME_FRONTEND')}${config.get('LINK_CONFIRMATION_FRONTEND_ADMIN')}/${token}`
        }
    })

    if (emailInfo) {

        return null

    } else {

        throw new customSimpleError()

    }

}

exports.signupAdminPartTwo = async function signupAdminPartTwo(data) {

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

exports.signup = async function signup(data) {

    const jwtSignAsync = Promise.promisify(jwt.sign)

    let uuidPromise = generateUuid(User, 'uuid')
    let passwordHashPromise = bcrypt.hash(data.password, saltRound)

    let [uuid, passwordHash] = await Promise.all([uuidPromise, passwordHashPromise])

    delete data.confirm_password
    data.password = passwordHash
    data.uuid = uuid
    data.role = "user"

    let userCreated = await new User(data).save()

    const token = await jwtSignAsync({
        id: userCreated._id
    }, privateKey, {
        expiresIn: tokenExpiry1h
    })

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

}

exports.signupPartTwo = async function signupPartTwo({
    id
}) {

    await User.findOneAndUpdate({
        _id: id
    }, {
        status: true
    }).exec()

    return null

}

exports.checkToken = async function checkToken({
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

exports.resetPasswordPartOne = async function resetPasswordPartOne({
    email
}) {

    const jwtSignAsync = Promise.promisify(jwt.sign)

    let userGet = await User.findOne({
        email
    }).exec()

    const token = await jwtSignAsync({
        id: userGet._id
    }, privateKey, {
        expiresIn: tokenExpiry1h
    })

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


}

exports.resetPasswordPartTwo = async function resetPasswordPartTwo({
    id,
    password
}) {

    const hash = await bcrypt.hash(password, saltRound)

    await User.findOneAndUpdate({
        _id: id
    }, {
        password: hash
    }).exec()

    return null

}