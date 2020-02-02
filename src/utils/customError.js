import logger from './logger.js'
import emailController from '../email/controller.js'
import config from 'config'

export class MyError extends Error {

    constructor(message) {
        super(message)
        this.isLogged = true
        this.isOperationalError = true
        this.name = this.constructor.name
    }

}

export class ValidationError extends MyError {

    constructor(message, isLogged = false) {
        super(message)
        this.isLogged = isLogged
        this.code = "VALIDATION_ERROR"
    }

}

export class PropertyInvalidWithMessageError extends ValidationError {

    constructor(property, message, isLogged = false) {
        super(message, isLogged);
        this.property = property
        this.code = "PROPERTY_INVALID"
    }

}

export class PropertyInvalidError extends PropertyInvalidWithMessageError {

    constructor(property, isLogged = false) {
        super(property, `${property} is required or invalid, please retry !`, isLogged);
    }

}

export class customError extends MyError {

    constructor(message, code = "ERROR", isLogged = false) {
        super(message)
        this.isLogged = isLogged
        this.code = code
    }

}

export class customErrorWithCause extends customError {

    constructor(message, cause, code = "ERROR", isLogged = false) {
        super(message, code, isLogged)
        this.cause = cause
    }

}

export class customSimpleError extends customError {

    constructor(isLogged = false) {
        super(`Operation failure, it seems like something went wrong, please retry !`, 'ERROR', isLogged)
    }

}

export async function isOperationalError (error) {

    const response = error.isOperationalError

    return response

}

export async function logError (error) {

    if (typeof error.isLogged === 'undefined' || error.isLogged) {

        logger.error(`\nName : ${error.name || ''} \nMessage : ${error.message || ''} \nCode : ${error.code || ''} \nStack : ${error.stack || ''}`)

    }

    return

}

export async function sendMailToAdmin (error) {

    if(process.env.NODE_ENV !== "development"){

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
                to : JSON.parse(config.get('email.EMAIL_ADMIN')),
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

export async function handleError (error) {

    await logError(error)
    await sendMailToAdmin(error)
    return await isOperationalError(error)

}