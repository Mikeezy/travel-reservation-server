const logger = require('./logger')
const emailController = require('../email/controller')
const config = require('config')

class MyError extends Error {

    constructor(message) {
        super(message)
        this.isLogged = true
        this.isOperationalError = true
        this.name = this.constructor.name
    }

}

exports.MyError = MyError

class ValidationError extends MyError {

    constructor(message, isLogged = false) {
        super(message)
        this.isLogged = isLogged
        this.code = "VALIDATION_ERROR"
    }

}

exports.ValidationError = ValidationError

class PropertyInvalidWithMessageError extends ValidationError {

    constructor(property, message, isLogged = false) {
        super(message, isLogged);
        this.property = property
        this.code = "PROPERTY_INVALID"
    }

}

exports.PropertyInvalidWithMessageError =  PropertyInvalidWithMessageError

class PropertyInvalidError extends PropertyInvalidWithMessageError {

    constructor(property, isLogged = false) {
        super(property, `${property} is required or invalid, please retry !`, isLogged);
    }

}

exports.PropertyInvalidError =  PropertyInvalidError

class customError extends MyError {

    constructor(message, code = "ERROR", isLogged = false) {
        super(message)
        this.isLogged = isLogged
        this.code = code
    }

}

exports.customError =  customError

class customErrorWithCause extends customError {

    constructor(message, cause, code = "ERROR", isLogged = false) {
        super(message, code, isLogged)
        this.cause = cause
    }

}

exports.customErrorWithCause =  customErrorWithCause

class customSimpleError extends customError {

    constructor(isLogged = false) {
        super(`Operation failure, it seems like something went wrong, please retry !`, 'ERROR', isLogged)
    }

}

exports.customSimpleError =  customSimpleError

async function isOperationalError (error) {

    const response = error.isOperationalError

    return response

}

exports.isOperationalError =  isOperationalError

async function logError (error) {

    if (typeof error.isLogged === 'undefined' || error.isLogged) {

        logger.error(`\nName : ${error.name || ''} \nMessage : ${error.message || ''} \nCode : ${error.code || ''} \nStack : ${error.stack || ''}`)

    }

    return

}

exports.logError =  logError

async function sendMailToAdmin (error) {

    const check = await isOperationalError(error)

    if(process.env.NODE_ENV !== "development" && !check){

        try {
        
            const content = `
                <br/>
                <p style="font-weight : bold;">Name : ${error.name || ''}</p>
                <br/>
                <p style="font-weight : bold;">Message : ${error.message || ''}</p>
                <br/>
                <p>Code : ${error.code || ''}</p>
                <br/>
                <p>Stack : ${error.stack || ''}</p>
                <br/>
            `
            await emailController.sendMail({
                to : config.get('email.EMAIL_ADMIN'),
                subject : "Critical error occured, please check it out",
                content
            })

            return 

        } catch (e) {
        
            logger.error(`\nMessage : ${e.message || ''} \nStack : ${e.stack || ''}`)

        }

    }

    return 

}

exports.sendMailToAdmin =  sendMailToAdmin

async function handleError (error) {

    await logError(error)
    await sendMailToAdmin(error)
    return await isOperationalError(error)

}

exports.handleError =  handleError