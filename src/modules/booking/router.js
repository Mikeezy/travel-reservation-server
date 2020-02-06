import express from 'express'
import cacheMiddleware from '../../middlewares/cacheMiddleware.js'
import validationHandlerMiddleware from '../../middlewares/validationHandlerMiddleware.js'
import asyncMiddleware from '../../middlewares/asyncMiddleware.js'
import responseHandlerMiddleware from '../../middlewares/responseHandlerMiddleware.js'
import validator from 'express-validator'
import validationSchema from './validation.js'
import {
    getAll,
    block,
    getByReference,
    save
} from './controller.js'

const router = express.Router()

router.get('/',
    cacheMiddleware.get,
    asyncMiddleware(async (req, res, next) => {

        res.locals.data = await getAll()

        next()
    }),
    cacheMiddleware.set,
    responseHandlerMiddleware
)

router.get('/getByReference/:reference',
    cacheMiddleware.get,
    validator.checkSchema(validationSchema.referenceSchema),
    validationHandlerMiddleware,
    asyncMiddleware(async (req, res, next) => {

        const data = {
            ...req.params
        }

        res.locals.data = await getByReference(data)

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

router.post('/save',
    validator.checkSchema(validationSchema.saveSchema),
    validationHandlerMiddleware,
    asyncMiddleware(async (req, res, next) => {

        const data = {
            ...req.body
        }

        res.locals.data = await save(data)

        next()
    }),
    cacheMiddleware.clear,
    responseHandlerMiddleware
)


export default router