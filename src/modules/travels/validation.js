const moment = require('moment')
const Country = require('../countries/model')

const blockSchema = {
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
        in: 'body',
        isMongoId: true,
        errorMessage: 'Lieu de départ invalide',
        bail: true,
        custom: {
            options: async (value) => {

                const town = await Country.findOne({
                    'towns._id': value
                },{'towns.$' : 1}).select('_id').exec()

                if (!town) {
                    throw new Error(`Cette ville n'existe pas, veuillez réessayer svp !`);
                }

                return true

            }
        }
    },
    to: {
        in: 'body',
        isMongoId: true,
        errorMessage: `Lieu d'arrivé invalide`,
        bail: true,
        custom: {
            options: async (value,{req}) => {

                const town = await Country.findOne({
                    'towns._id': value
                },{'towns.$' : 1}).select('_id').exec()

                if (!town) {
                    throw new Error(`Cette ville n'existe pas, veuillez réessayer svp !`);
                }else if(value === req.body.from){
                    throw new Error(`Le lieu d'arrivé ne peut pas être égal au lieu de départ, veuillez réessayer svp !`);
                }

                return true

            }
        }
    },
    price: {
        in: 'body',
        toInt: true,
        isInt: {
            errorMessage: `Le prix doit être un chiffre et doit être au minimum égale à 0  svp !`,
            options: {
                min: 0
            }
        }
    },
    date_departing: {
        in: 'body',
        toDate: true,
        custom : {
            options : (value) => {
                
                if(!moment(value).isValid()){
                    throw new Error(`Date de départ invalide`)
                }
    
                return true
            }
        }
    },
    date_arriving: {
        in: 'body',
        toDate: true,
        custom : {
            options : (value, {req}) => {
                
                if(!moment(value).isValid()){
                    throw new Error(`Date d'arrivée invalide`)
                }else if(moment(value).isBefore(moment(req.body.date_departing))){
                    throw new Error(`La date d'arrivée doit être supérieure à la date de départ`)
                }
    
                return true
            }
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
        custom : {
            options : (value, {req}) => {
                
                if(!moment(value).isValid()){
                    throw new Error(`Date de retour invalide`)
                }else if(moment(value).isBefore(moment(req.body.date_departing)) || moment(value).isBefore(moment(req.body.date_arriving))){
                    throw new Error(`La date de retour doit être supérieure à la date de départ ou à la date d'arrviée`)
                }
    
                return true
            }
        }
    },
    'driving.*.bus': {
        in: 'body',
        isMongoId: true,
        errorMessage: 'Bus invalide'
    }
}




module.exports = {
    blockSchema,
    saveSchema,
    getAllSchema
}