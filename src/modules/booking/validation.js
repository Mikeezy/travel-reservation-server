import moment from 'moment'

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
        custom : {
            options : (value) => {
                
                try {

                    const obj = JSON.parse(JSON.stringify(value));

                    if (obj && typeof obj === "object" && obj !== null) {
                        
                        return obj;
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

const searchSchema = {
    from: {
        in: 'body',
        isMongoId: true,
        errorMessage: 'Lieu de départ invalide'
    },
    to: {
        in: 'body',
        isMongoId: true,
        errorMessage: `Lieu d'arrivé invalide`
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


export default {
    blockSchema,
    saveSchema,
    referenceSchema,
    getAllSchema,
    searchSchema
}