import moment from 'moment'

const blockSchema = {
    id: {
        in: 'params',
        isMongoId: true,
        errorMessage: 'Id invalide'
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
    from: {
        in: 'params',
        isMongoId: true,
        errorMessage: 'Lieu de départ invalide'
    },
    to: {
        in: 'params',
        isMongoId: true,
        errorMessage: `Lieu d'arrivé invalide`
    },
    price: {
        in: 'body',
        toInt: true,
        isInt: {
            errorMessage: `Le prix doit être un chiffre et doit être au minimum égale à 0  svp !`,
            options: {
                min: 2
            }
        }
    },
    date_departing: {
        in: 'body',
        toDate: true,
        errorMessage: 'Date de départ invalide'
    },
    date_arriving: {
        in: 'body',
        toDate: true,
        errorMessage: `Date d'arrivée invalide`,
        bail : true,
        options : (value, {req}) => {
            
            if(moment(req.body.date_departing).isSameOrAfter(value)){
                throw new Error(`La date de départ doit être inférieure à la date d'arrivée`)
            }

            return true
        }
    },
    date_return: {
        in: 'body',
        optional: {
            options: {
                checkFalsy: true,
            },
        },
        toDate: true,
        errorMessage: 'Date de retour invalide'
    },
    'driving.*.bus': {
        in: 'body',
        isMongoId: true,
        errorMessage: 'Bus invalide'
    },
    'driving.*.driver': {
        in: 'body',
        isMongoId: true,
        errorMessage: 'Chauffeur invalide'
    }
}


export default {
    blockSchema,
    saveSchema
}