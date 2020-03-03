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
    saveCountry,
    getAllCountriesForSelect
} = require('./controller')

const router = express.Router()

router.use(authMiddleware)

router.get('/',
    validator.checkSchema(validationSchema.getAllSchema),
    validationHandlerMiddleware,
    cacheMiddleware.get,
    asyncMiddleware(async (req, res, next) => {

        const data = {
            ...req.query,
            status: true
        }

        res.locals.data = await getAllCountry(data)

        next()
    }),
    cacheMiddleware.set,
    responseHandlerMiddleware
)

router.get('/getAll',
    validator.checkSchema(validationSchema.getAllSchema),
    validationHandlerMiddleware,
    cacheMiddleware.get,
    asyncMiddleware(async (req, res, next) => {

        const data = {
            ...req.query
        }

        res.locals.data = await getAllCountry(data)

        next()
    }),
    cacheMiddleware.set,
    responseHandlerMiddleware
)

router.get('/getAllForSelect',
    cacheMiddleware.get,
    asyncMiddleware(async (req, res, next) => {

        res.locals.data = await getAllCountriesForSelect()

        next()
    }),
    cacheMiddleware.set,
    responseHandlerMiddleware
)

router.get('/block/:id',
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
    validator.checkSchema(validationSchema.saveCountrySchema),
    validationHandlerMiddleware,
    asyncMiddleware(async (req, res, next) => {

        const data = {
            ...req.body
        }

        res.locals.data = await saveCountry(data)

        next()
    }),
    cacheMiddleware.customClear('/v1/town'),
    cacheMiddleware.clear,
    responseHandlerMiddleware
)


module.exports = router