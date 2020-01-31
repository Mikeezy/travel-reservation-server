import User from './model.js'

const authSchema = {
    email: {
        in: 'body',
        isEmail: true,
        normalizeEmail: true,
        errorMessage: 'Invalid email'
    },
    password: {
        in: 'body',
        isLength: {
            errorMessage: 'Password must contain at least 7 characters !',
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
        errorMessage: 'Invalid email',
        bail: true,
        custom: {
            options: async (value) => {

                const userEmail = await User.findOne({
                    email: value
                }).select('_id').exec()

                if (userEmail) {
                    throw new Error('E-mail already in use, please retry !');
                }

                return true

            }
        }
    },
    role: {
        in: 'body',
        isIn: ['super admin', 'admin', 'manager', 'user', 'driver'],
        errorMessage: 'Invalid role'
    }
}

const signupAdminPartTwoSchema = {
    token: {
        in: 'params',
        isJWT: true,
        errorMessage: 'Invalid token'
    },
    firstname: {
        in: 'body',
        trim: true,
        escape: true,
        isLength: {
            errorMessage: 'Firstname must contain at least 2 characters !',
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
            errorMessage: 'Lastname must contain at least 2 characters !',
            options: {
                min: 2
            }
        }
    },
    password: {
        in: 'body',
        isLength: {
            errorMessage: 'Password must contain at least 7 characters !',
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
                    throw new Error('Password confirmation does not match password');
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
            errorMessage : 'Invalid phone number'
        }
    }
}

const resetPasswordPartOneSchema = {
    email: {
        in: 'body',
        isEmail: true,
        normalizeEmail: true,
        errorMessage: 'Invalid email',
        bail: true,
        custom: {
            options: async (value) => {

                const userEmail = await User.findOne({
                    email: value
                }).select('_id').exec()

                if (!userEmail) {
                    throw new Error('E-mail does not exist, please retry !');
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
        errorMessage: 'Invalid token'
    }
}

const resetPasswordPartThreeSchema = {
    token: {
        in: 'body',
        isJWT: true,
        errorMessage: 'Invalid token'
    },
    password: {
        in: 'body',
        isLength: {
            errorMessage: 'Password must contain at least 7 characters !',
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
                    throw new Error('Password confirmation does not match password !');
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
        errorMessage: 'Invalid token'
    }
}

const blockSchema = {
    id: {
        in: 'params',
        isMongoId: true,
        errorMessage: 'Invalid id'
    }
}

const updatePasswordSchema = {
    password: {
        in: 'body',
        isLength: {
            errorMessage: 'Password must contain at least 7 characters !',
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
                    throw new Error('Password confirmation does not match password !');
                }

                return true

            }
        }
    },
    old_password : {
        in: 'body',
        isLength: {
            errorMessage: 'Old password must contain at least 7 characters !',
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
            errorMessage: 'Firstname must contain at least 2 characters !',
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
            errorMessage: 'Lastname must contain at least 2 characters !',
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
            errorMessage : 'Invalid phone number'
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