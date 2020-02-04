const blockSchema = {
    id: {
        in: 'params',
        isMongoId: true,
        errorMessage: 'Id invalide'
    }
}

const saveSchema = {
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
    immatriculation_number : {
        in: 'body',
        trim: true,
        escape: true,
        isLength: {
            errorMessage: `Le numéro d'immatriculation doit contenir au moins 4 caractères svp !`,
            options: {
                min: 4
            }
        }
    },
    capacity : {
        in: 'body',
        toInt : true,
        isInt : {
            errorMessage : `La capacité du bus doit être un chiffre et doit être au minimum égale à 2  svp !`,
            options : {
                min : 2
            }
        }
    }
}


export default {
    blockSchema,
    saveSchema
}