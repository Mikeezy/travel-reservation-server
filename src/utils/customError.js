export class MyError extends Error {

    constructor(message) {
        super(message)
        this.isLogged = true
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