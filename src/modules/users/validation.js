import User from './model.js'

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
                min: 7
            }
        }
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
        isIn: ['super admin', 'admin', 'manager', 'user', 'driver'],
        errorMessage: 'Role invalide'
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
        optional : {
            options: {
                checkFalsy: true,
            },
        },
        matches : {
            options : ['/^(2|7|9){1}[0-9]{7}$/i'],
            errorMessage : 'Numéro de téléphone invalide'
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
    }
}

const resetPasswordPartThreeSchema = {
    token: {
        in: 'body',
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
            errorMessage: `L'ancien mot de passe doit contenir au moins 7 caractères svp !`,
            options: {
                min: 7
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
        optional : {
            options: {
                checkFalsy: true,
            },
        },
        matches : {
            options : ['/^(2|7|9){1}[0-9]{7}$/i'],
            errorMessage : 'Numéro de téléphone invalide'
        }
    }
}

export default {
    auth: authSchema,
    signupAdminPartOneSchema,
    signupAdminPartTwoSchema,
    resetPasswordPartOneSchema,
    resetPasswordPartTwoSchema,
    resetPasswordPartThreeSchema,
    checkTokenSchema,
    blockSchema,
    updatePasswordSchema,
    updateProfileSchema
}