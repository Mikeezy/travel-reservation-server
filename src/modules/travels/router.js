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
    save
} from './controller.js'

const router = express.Router()

router.get('/',
    authMiddleware,
    cacheMiddleware.get,
    validator.checkSchema(validationSchema.getAllSchema),
    validationHandlerMiddleware,
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



router.post('/save',
    authMiddleware,
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