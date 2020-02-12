import express from 'express'
import authMiddleware from '../../middlewares/authMiddleware.js'
import cacheMiddleware from '../../middlewares/cacheMiddleware.js'
import validationHandlerMiddleware from '../../middlewares/validationHandlerMiddleware.js'
import asyncMiddleware from '../../middlewares/asyncMiddleware.js'
import responseHandlerMiddleware from '../../middlewares/responseHandlerMiddleware.js'
import validator from 'express-validator'
import validationSchema from './validation.js'
import {
    getAllTownByCountry,
    blockTown,
    saveTown,
    getAllTowns
} from './controller.js'

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


export default router