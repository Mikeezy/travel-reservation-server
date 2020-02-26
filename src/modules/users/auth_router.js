const express = require('express')
const cacheMiddleware = require('../../middlewares/cacheMiddleware')
const validationHandlerMiddleware = require('../../middlewares/validationHandlerMiddleware')
const asyncMiddleware = require('../../middlewares/asyncMiddleware')
const responseHandlerMiddleware = require('../../middlewares/responseHandlerMiddleware')
const validator = require('express-validator')
const validationSchema = require('./validation')
const {
    auth,
    checkToken,
    signup,
    signupAdminPartTwo,
    signupPartTwo,
    resetPasswordPartOne,
    resetPasswordPartTwo
} = require('./controller')
const {
    authLimiterMiddleware
} = require('../../middlewares/rateLimitMiddleware')

const router = express.Router()


router.post('/signin',
    validator.checkSchema(validationSchema.auth),
    validationHandlerMiddleware,
    asyncMiddleware(async (req, res, next) => {

        const data = {
            ...req.body
        }

        res.locals.data = await auth(data)

        next()
    }),
    responseHandlerMiddleware
)

router.post('/signinAdmin',
    validator.checkSchema(validationSchema.auth),
    validationHandlerMiddleware,
    asyncMiddleware(async (req, res, next) => {

        const data = {
            ...req.body,
            expiresIn: true
        }

        res.locals.data = await auth(data)

        next()
    }),
    responseHandlerMiddleware
)

router.post('/signup',
    validator.checkSchema(validationSchema.signup),
    validationHandlerMiddleware,
    asyncMiddleware(async (req, res, next) => {

        const data = {
            ...req.body
        }

        res.locals.data = await signup(data)

        next()
    }),
    responseHandlerMiddleware
)



router.post('/signupAdminPartTwo/:token',
    validator.checkSchema(validationSchema.signupAdminPartTwoSchema),
    validationHandlerMiddleware,
    authLimiterMiddleware({
        max: 5,
        message: "Vous avez trop user de cette action, veuillez réessayer après une heure svp !"
    }),
    asyncMiddleware(async (req, res, next) => {

        const decoded = await checkToken({
            ...req.params
        })
        const data = {
            ...req.body,
            ...decoded
        }

        res.locals.data = await signupAdminPartTwo(data)

        next()
    }),
    cacheMiddleware.clear,
    responseHandlerMiddleware
)

router.get('/signupPartTwo/:token',
    validator.checkSchema(validationSchema.signupPartTwoSchema),
    validationHandlerMiddleware,
    authLimiterMiddleware({
        max: 5,
        message: "Vous avez trop user de cette action, veuillez réessayer après une heure svp !"
    }),
    asyncMiddleware(async (req, res, next) => {

        const data = await checkToken({
            ...req.params
        })

        res.locals.data = await signupPartTwo(data)

        next()
    }),
    cacheMiddleware.clear,
    responseHandlerMiddleware
)

router.post('/resetPasswordPartOne',
    validator.checkSchema(validationSchema.resetPasswordPartOneSchema),
    validationHandlerMiddleware,
    authLimiterMiddleware({
        max: 5,
        message: "Vous avez trop user de cette action, veuillez réessayer après une heure svp !"
    }),
    asyncMiddleware(async (req, res, next) => {

        const data = {
            ...req.body
        }

        res.locals.data = await resetPasswordPartOne(data)

        next()
    }),
    responseHandlerMiddleware
)

router.post('/resetPasswordPartTwo/:token',
    validator.checkSchema(validationSchema.resetPasswordPartTwoSchema),
    validationHandlerMiddleware,
    authLimiterMiddleware({
        max: 5,
        message: "Vous avez trop user de cette action, veuillez réessayer après une heure svp !"
    }),
    asyncMiddleware(async (req, res, next) => {

        const decoded = await checkToken({
            ...req.params
        })

        const data = {
            ...req.body,
            ...decoded
        }

        res.locals.data = await resetPasswordPartTwo(data)

        next()
    }),
    responseHandlerMiddleware
)

router.get('/checkToken/:token',
    validator.checkSchema(validationSchema.checkTokenSchema),
    validationHandlerMiddleware,
    asyncMiddleware(async (req, res, next) => {

        const data = {
            ...req.params
        }

        res.locals.data = await checkToken(data)

        next()
    }),
    responseHandlerMiddleware
)

module.exports = router