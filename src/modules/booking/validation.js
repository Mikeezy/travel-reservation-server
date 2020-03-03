const moment = require('moment')
const User = require('../users/model')
const Travel = require('../travels/model')
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
    },
    travelId: {
        in: 'params',
        isMongoId: true,
        errorMessage: 'Voyage invalide',
        bail: true,
        custom: {
            options: async (value) => {

                const travel = await Travel.findOne({
                    _id: value
                }).select('_id').exec()

                if (!travel) {
                    throw new Error(`Ce voyage n'existe pas, veuillez réessayer svp !`);
                }

                return true

            }
        }
    }
}

const referenceSchema = {
    reference: {
        in: 'params',
        trim: true,
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
        errorMessage: 'Utilisateur invalide',
        bail: true,
        custom: {
            options: async (value) => {

                const user = await User.findOne({
                    _id: value
                }).select('_id').exec()

                if (!user) {
                    throw new Error(`Cet utilisateur n'existe pas, veuillez réessayer svp !`);
                }

                return true

            }
        }
    },
    guest: {
        in: 'body',
        optional: {
            options: {
                checkFalsy: true,
            },
        },
        custom : {
            options : (value) => {
                
                try {

                    const obj = JSON.parse(JSON.stringify(value));

                    if (obj && typeof obj === "object" && obj !== null && obj.fullname && obj.phone_number) {
                        
                        return true;
                    }
                    
                    throw new Error('Invité invalide')

                } catch (e) {
                    
                    throw new Error('Invité invalide')

                }
            }
        }
    },
    travel: {
        in: 'body',
        isMongoId: true,
        errorMessage: 'Voyage invalide',
        bail: true,
        custom: {
            options: async (value) => {

                const travel = await Travel.findOne({
                    _id: value
                }).select('_id').exec()

                if (!travel) {
                    throw new Error(`Ce voyage n'existe pas, veuillez réessayer svp !`);
                }

                return true

            }
        }
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

const searchSchema = {
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
    }
}

module.exports = {
    blockSchema,
    saveSchema,
    referenceSchema,
    getAllSchema,
    searchSchema
}