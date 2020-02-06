import moment from 'moment'

const blockSchema = {
    id: {
        in: 'params',
        isMongoId: true,
        errorMessage: 'Id invalide'
    }
}

const referenceSchema = {
    reference: {
        in: 'params',
        trim: true,
        escape: true,
        isLength: {
            errorMessage: 'La référence doit contenir au moins 10 caractères svp !',
            options: {
                min: 10
            }
        }
    }
}


const saveSchema = {
    id: {
        in: 'body',
        optional: {
            options: {
                checkFalsy: true,
            },
        },
        isMongoId: true,
        errorMessage: 'Id invalide'
    },
    user: {
        in: 'body',
        optional: {
            options: {
                checkFalsy: true,
            },
        },
        isMongoId: true,
        errorMessage: 'Utilisateur invalide'
    },
    guest: {
        in: 'body',
        optional: {
            options: {
                checkFalsy: true,
            },
        },
        toJson : true,
        errorMessage: 'Invité invalide'
    },
    travel: {
        in: 'body',
        isMongoId: true,
        errorMessage: 'Voyage invalide'
    },
    passenger_number: {
        in: 'body',
        toInt: true,
        isInt: {
            errorMessage: `Le nombre de place souhaité doit être au minimum égale à 1  svp !`,
            options: {
                min: 1
            }
        }
    }
}


export default {
    blockSchema,
    saveSchema,
    referenceSchema
}