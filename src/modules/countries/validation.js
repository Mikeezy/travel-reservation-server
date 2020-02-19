const blockCountrySchema = {
    id: {
        in: 'params',
        isMongoId: true,
        errorMessage: 'Id invalide'
    }
}

const getAllSchema = {
    offset: {
        in: 'query',
        optional: {
            options: {
                checkFalsy: true,
            },
        },
        toInt : true,
        isInt: {
            options: {
                min: 0
            }
        },
        errorMessage: `Décalage invalide`
    },
    limit: {
        in: 'query',
        optional: {
            options: {
                checkFalsy: true,
            },
        },
        toInt : true,
        isInt: {
            options: {
                min: 1
            }
        },
        errorMessage: `Limite invalide`
    }
}

const saveCountrySchema = {
    name: {
        in: 'body',
        trim: true,
        escape: true,
        isLength: {
            errorMessage: 'Le nom doit contenir au moins 2 caractères svp !',
            options: {
                min: 2
            }
        }
    },
    id : {
        in: 'body',
        optional : {
            options: {
                checkFalsy: true,
            },
        },
        isMongoId: true,
        errorMessage: 'Id invalide'
    }
}

const saveTownSchema = {
    name: {
        in: 'body',
        trim: true,
        escape: true,
        isLength: {
            errorMessage: 'Le nom doit contenir au moins 2 caractères svp !',
            options: {
                min: 2
            }
        }
    },
    description : {
        in: 'body',
        optional : {
            options: {
                checkFalsy: true,
            },
        },
        isLength: {
            errorMessage: 'La description doit contenir au moins 2 caractères svp !',
            options: {
                min: 2
            }
        }
    },
    id : {
        in: 'body',
        optional : {
            options: {
                checkFalsy: true,
            },
        },
        isMongoId: true,
        errorMessage: 'Id ville invalide'
    },
    idCountry : {
        in: 'body',
        isMongoId: true,
        errorMessage: 'Id pays invalide'
    }
}

module.exports = {
    blockCountrySchema,
    saveCountrySchema,
    saveTownSchema,
    getAllSchema
}