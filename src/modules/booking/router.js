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
    getByReference,
    save,
    search
} from './controller.js'

const router = express.Router()

router.get('/',
    authMiddleware,
    validator.checkSchema(validationSchema.getAllSchema),
    validationHandlerMiddleware,
    cacheMiddleware.get,
    asyncMiddleware(async (req, res, next) => {

        const data = {
            ...req.query
        }

        res.locals.data = await getAll(data)

        next()
    }),
    cacheMiddleware.set,
    responseHandlerMiddleware
)

router.get('/getByReference/:reference',
    validator.checkSchema(validationSchema.referenceSchema),
    validationHandlerMiddleware,
    cacheMiddleware.get,
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
    authMiddleware,
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

router.post('/search',
    validator.checkSchema(validationSchema.searchSchema),
    validationHandlerMiddleware,
    cacheMiddleware.getByBody,
    asyncMiddleware(async (req, res, next) => {

        const data = {
            ...req.body
        }

        res.locals.data = await search(data)

        next()
    }),
    cacheMiddleware.setByBody,
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