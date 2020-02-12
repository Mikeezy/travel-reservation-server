const express = require('express')
const authMiddleware = require('../../middlewares/authMiddleware')
const cacheMiddleware = require('../../middlewares/cacheMiddleware')
const validationHandlerMiddleware = require('../../middlewares/validationHandlerMiddleware')
const asyncMiddleware = require('../../middlewares/asyncMiddleware')
const responseHandlerMiddleware = require('../../middlewares/responseHandlerMiddleware')
const validator = require('express-validator')
const validationSchema = require('./validation')
const {
    getAllCountry,
    blockCountry,
    saveCountry
} = require('./controller')

const router = express.Router()


router.get('/',
    cacheMiddleware.get,
    asyncMiddleware(async (req, res, next) => {

        res.locals.data = await getAllCountry(true)

        next()
    }),
    cacheMiddleware.set,
    responseHandlerMiddleware
)

router.get('/getAll',
    authMiddleware,
    cacheMiddleware.get,
    asyncMiddleware(async (req, res, next) => {

        res.locals.data = await getAllCountry()

        next()
    }),
    cacheMiddleware.set,
    responseHandlerMiddleware
)

router.get('/block/:id',
    authMiddleware,
    validator.checkSchema(validationSchema.blockCountrySchema),
    validationHandlerMiddleware,
    asyncMiddleware(async (req, res, next) => {

        const data = {
            ...req.params
        }

        res.locals.data = await blockCountry(data)

        next()
    }),
    cacheMiddleware.clear,
    responseHandlerMiddleware
)

router.post('/save',
    authMiddleware,
    validator.checkSchema(validationSchema.saveCountrySchema),
    validationHandlerMiddleware,
    asyncMiddleware(async (req, res, next) => {

        const data = {
            ...req.body
        }

        res.locals.data = await saveCountry(data)

        next()
    }),
    cacheMiddleware.clear,
    responseHandlerMiddleware
)


module.exports = router