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
    signupAdminPartTwo,
    resetPasswordPartOne,
    resetPasswordPartTwo,
    resetPasswordPartThree
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



router.post('/signupAdminPartTwo/:token',
    authLimiterMiddleware({
        max: 2,
        message: "Vous avez trop user de cette action, veuillez réessayer après une heure svp !"
    }),
    validator.checkSchema(validationSchema.signupAdminPartTwoSchema),
    validationHandlerMiddleware,
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

router.post('/resetPasswordPartOne',
    authLimiterMiddleware({
        max: 2,
        message: "Vous avez trop user de cette action, veuillez réessayer après une heure svp !"
    }),
    validator.checkSchema(validationSchema.resetPasswordPartOneSchema),
    validationHandlerMiddleware,
    asyncMiddleware(async (req, res, next) => {

        const data = {
            ...req.body
        }

        res.locals.data = await resetPasswordPartOne(data)

        next()
    }),
    responseHandlerMiddleware
)

router.get('/resetPasswordPartTwo/:token',
    authLimiterMiddleware({
        max: 2,
        message: "Vous avez trop user de cette action, veuillez réessayer après une heure svp !"
    }),
    validator.checkSchema(validationSchema.resetPasswordPartTwoSchema),
    validationHandlerMiddleware,
    asyncMiddleware(async (req, res, next) => {

        const data = {
            ...req.params
        }

        res.locals.data = await resetPasswordPartTwo(data)

        next()
    }),
    responseHandlerMiddleware
)

router.post('/resetPasswordPartThree',
    authLimiterMiddleware({
        max: 2,
        message: "Vous avez trop user de cette action, veuillez réessayer après une heure svp !"
    }),
    validator.checkSchema(validationSchema.resetPasswordPartThreeSchema),
    validationHandlerMiddleware,
    asyncMiddleware(async (req, res, next) => {

        const data = {
            ...req.body
        }

        res.locals.data = await resetPasswordPartThree(data)

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