const express = require('express')
const authMiddleware = require('../../middlewares/authMiddleware')
const cacheMiddleware = require('../../middlewares/cacheMiddleware')
const validationHandlerMiddleware = require('../../middlewares/validationHandlerMiddleware')
const asyncMiddleware = require('../../middlewares/asyncMiddleware')
const responseHandlerMiddleware = require('../../middlewares/responseHandlerMiddleware')
const validator = require('express-validator')
const validationSchema = require('./validation')
const {
    getAllTownByCountry,
    blockTown,
    saveTown,
    getAllTowns
} = require('./controller')

const router = express.Router()


router.get('/getAllByCountryId/:id',
    authMiddleware,
    cacheMiddleware.get,
    validator.checkSchema(validationSchema.blockCountrySchema),
    validationHandlerMiddleware,
    asyncMiddleware(async (req, res, next) => {

        const data = {
            ...req.params
        }

        res.locals.data = await getAllTownByCountry(data)

        next()
    }),
    cacheMiddleware.set,
    responseHandlerMiddleware
)

router.get('/getAll',
    cacheMiddleware.get,
    asyncMiddleware(async (req, res, next) => {

        res.locals.data = await getAllTowns()

        next()
    }),
    cacheMiddleware.set,
    responseHandlerMiddleware
)

router.get('/getByCountryId/:id',
    cacheMiddleware.get,
    validator.checkSchema(validationSchema.blockCountrySchema),
    validationHandlerMiddleware,
    asyncMiddleware(async (req, res, next) => {

        const data = {
            ...req.params,
            status: true
        }

        res.locals.data = await getAllTownByCountry(data)

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

        res.locals.data = await blockTown(data)

        next()
    }),
    cacheMiddleware.clear,
    responseHandlerMiddleware
)

router.post('/save',
    authMiddleware,
    validator.checkSchema(validationSchema.saveTownSchema),
    validationHandlerMiddleware,
    asyncMiddleware(async (req, res, next) => {

        const data = {
            ...req.body
        }

        res.locals.data = await saveTown(data)

        next()
    }),
    cacheMiddleware.clear,
    responseHandlerMiddleware
)


module.exports = router