import express from 'express'
import authMiddleware from '../../middlewares/authMiddleware.js'
import cacheMiddleware from '../../middlewares/cacheMiddleware.js'
import validationHandlerMiddleware from '../../middlewares/validationHandlerMiddleware.js'
import asyncMiddleware from '../../middlewares/asyncMiddleware.js'
import responseHandlerMiddleware from '../../middlewares/responseHandlerMiddleware.js'
import validator from 'express-validator'
import validationSchema from './validation.js'
import {
    getAll,
    block,
    signupAdminPartOne,
    updatePassword,
    updateProfile
} from './controller.js'

const router = express.Router()

router.use(authMiddleware)


router.get('/',
    cacheMiddleware.get,
    asyncMiddleware(async (req, res, next) => {

        res.locals.data = await getAll()

        next()
    }),
    cacheMiddleware.set,
    responseHandlerMiddleware
)

router.get('/block/:id',
    validator.checkSchema(validationSchema.blockSchema),
    validationHandlerMiddleware,
    asyncMiddleware(async (req, res, next) => {

        const data = {
            ...req.params
        }

        res.locals.data = await block(data)

        next()
    }),
    cacheMiddleware.clear,
    responseHandlerMiddleware
)

router.post('/updatePassword',
    validator.checkSchema(validationSchema.updatePasswordSchema),
    validationHandlerMiddleware,
    asyncMiddleware(async (req, res, next) => {

        const data = {
            ...req.body,
            user : res.locals.user
        }

        res.locals.data = await updatePassword(data)

        next()
    }),
    responseHandlerMiddleware
)

router.post('/updateProfile',
    validator.checkSchema(validationSchema.updateProfileSchema),
    validationHandlerMiddleware,
    asyncMiddleware(async (req, res, next) => {

        const data = {
            ...req.body,
            user : res.locals.user
        }

        res.locals.data = await updateProfile(data)

        next()
    }),
    cacheMiddleware.clear,
    responseHandlerMiddleware
)

router.post('/signupAdminPartOne',
    validator.checkSchema(validationSchema.signupAdminPartOneSchema),
    validationHandlerMiddleware,
    asyncMiddleware(async (req, res, next) => {

        const data = {
            ...req.body
        }

        res.locals.data = await signupAdminPartOne(data)

        next()
    }),
    responseHandlerMiddleware
)



export default router