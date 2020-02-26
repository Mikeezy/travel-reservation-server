const User = require('./model')
const { parsePhoneNumberFromString } = require('libphonenumber-js')

const authSchema = {
    email: {
        in: 'body',
        isEmail: true,
        normalizeEmail: true,
        errorMessage: 'Email invalide'
    },
    password: {
        in: 'body',
        isLength: {
            errorMessage: 'Le mot de passe doit contenir au moins 7 caractères svp !',
            options: {
                min: 5
            }
        }
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

const signupAdminPartOneSchema = {
    email: {
        in: 'body',
        isEmail: true,
        normalizeEmail: true,
        errorMessage: 'Email invalide',
        bail: true,
        custom: {
            options: async (value) => {

                const userEmail = await User.findOne({
                    email: value
                }).select('_id').exec()

                if (userEmail) {
                    throw new Error('Cet email est déjà utilisé, veuillez réessayer svp !');
                }

                return true

            }
        }
    },
    role: {
        in: 'body',
        custom : {
            options : function(value) {
                const check = ['admin', 'manager']
                if(check.includes(value)){
                    return true
                }else{
                    throw new Error('Role invalide');
                }

            }
        }
    }
}

const signupAdminPartTwoSchema = {
    token: {
        in: 'params',
        isJWT: true,
        errorMessage: 'Token invalide'
    },
    firstname: {
        in: 'body',
        trim: true,
        escape: true,
        isLength: {
            errorMessage: 'Le prénom doit contenir au moins 2 caractères svp !',
            options: {
                min: 2
            }
        }
    },
    lastname: {
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
    password: {
        in: 'body',
        isLength: {
            errorMessage: 'Le mot de passe doit contenir au moins 7 caractères svp !',
            options: {
                min: 7
            }
        },
    },
    confirm_password: {
        in: 'body',
        custom: {
            options: (value, {req}) => {

                if (value !== req.body.password) {
                    throw new Error('Le mot de passe confirmé est différent du mot de passe, veuillez réessayer svp !');
                }

                return true

            }
        }
    },
    phone_number : {
        in: 'body',
        custom : {
            options : function (value){
                try {
                
                    const phoneNumber = parsePhoneNumberFromString(value)

                    if(phoneNumber.isPossible()){
                        return true
                    }else{
                        throw new Error(`Numéro de téléphone invalide`)
                    }

                } catch (e) {
                    throw new Error(`Numéro de téléphone invalide`)
                }
            }
        }
    }
}

const signupPartTwoSchema = {
    token: {
        in: 'params',
        isJWT: true,
        errorMessage: 'Token invalide'
    }
}

const signup = {
    firstname: {
        in: 'body',
        trim: true,
        escape: true,
        isLength: {
            errorMessage: 'Le prénom doit contenir au moins 2 caractères svp !',
            options: {
                min: 2
            }
        }
    },
    lastname: {
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
    email: {
        in: 'body',
        isEmail: true,
        normalizeEmail: true,
        errorMessage: 'Email invalide',
        bail: true,
        custom: {
            options: async (value) => {

                const userEmail = await User.findOne({
                    email: value
                }).select('_id').exec()

                if (userEmail) {
                    throw new Error('Cet email est déjà utilisé, veuillez réessayer svp !');
                }

                return true

            }
        }
    },
    password: {
        in: 'body',
        isLength: {
            errorMessage: 'Le mot de passe doit contenir au moins 7 caractères svp !',
            options: {
                min: 7
            }
        },
    },
    confirm_password: {
        in: 'body',
        custom: {
            options: (value, {req}) => {

                if (value !== req.body.password) {
                    throw new Error('Le mot de passe confirmé est différent du mot de passe, veuillez réessayer svp !');
                }

                return true

            }
        }
    },
    phone_number : {
        in: 'body',
        custom : {
            options : function (value){
                try {
                
                    const phoneNumber = parsePhoneNumberFromString(value)

                    if(phoneNumber.isPossible()){
                        return true
                    }else{
                        throw new Error(`Numéro de téléphone invalide`)
                    }

                } catch (e) {
                    throw new Error(`Numéro de téléphone invalide`)
                }
            }
        }
    }
}

const resetPasswordPartOneSchema = {
    email: {
        in: 'body',
        isEmail: true,
        normalizeEmail: true,
        errorMessage: 'Email invalide',
        bail: true,
        custom: {
            options: async (value) => {

                const userEmail = await User.findOne({
                    email: value
                }).select('_id').exec()

                if (!userEmail) {
                    throw new Error(`Cet email n'existe pas, veuillez réessayer svp !`);
                }

                return true

            }
        }
    }
}

const resetPasswordPartTwoSchema = {
    token: {
        in: 'params',
        isJWT: true,
        errorMessage: 'Token invalide'
    },
    password: {
        in: 'body',
        isLength: {
            errorMessage: 'Le mot de passe doit contenir au moins 7 caractères svp !',
            options: {
                min: 7
            }
        },
    },
    confirm_password: {
        in: 'body',
        custom: {
            options: (value, {req}) => {

                if (value !== req.body.password) {
                    throw new Error('Le mot de passe confirmé est différent du mot de passe, veuillez réessayer svp ! !');
                }

                return true

            }
        }
    }
}

const checkTokenSchema = {
    token: {
        in: 'params',
        isJWT: true,
        errorMessage: 'Token invalide'
    }
}

const blockSchema = {
    id: {
        in: 'params',
        isMongoId: true,
        errorMessage: 'Id invalide'
    }
}

const updatePasswordSchema = {
    password: {
        in: 'body',
        isLength: {
            errorMessage: 'Le mot de passe doit contenir au moins 7 caractères svp !',
            options: {
                min: 7
            }
        },
    },
    confirm_password: {
        in: 'body',
        custom: {
            options: (value, {req}) => {

                if (value !== req.body.password) {
                    throw new Error('Le mot de passe confirmé est différent du mot de passe, veuillez réessayer svp ! !');
                }

                return true

            }
        }
    },
    old_password : {
        in: 'body',
        isLength: {
            errorMessage: `L'ancien mot de passe doit contenir au moins 5 caractères svp !`,
            options: {
                min: 5
            }
        },
    }
}

const updateProfileSchema = {
    firstname: {
        in: 'body',
        trim: true,
        escape: true,
        isLength: {
            errorMessage: 'Le prénom doit contenir au moins 2 caractères svp !',
            options: {
                min: 2
            }
        }
    },
    lastname: {
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
    phone_number : {
        in: 'body',
        custom : {
            options : function (value){
                try {
                
                    const phoneNumber = parsePhoneNumberFromString(value)

                    if(phoneNumber.isPossible()){
                        return true
                    }else{
                        throw new Error(`Numéro de téléphone invalide`)
                    }

                } catch (e) {
                    throw new Error(`Numéro de téléphone invalide`)
                }
            }
        }
    }
}

module.exports = {
    auth: authSchema,
    signupAdminPartOneSchema,
    signupAdminPartTwoSchema,
    resetPasswordPartOneSchema,
    resetPasswordPartTwoSchema,
    checkTokenSchema,
    blockSchema,
    updatePasswordSchema,
    updateProfileSchema,
    getAllSchema,
    signup,
    signupPartTwoSchema
}