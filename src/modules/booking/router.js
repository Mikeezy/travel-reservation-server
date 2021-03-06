const express = require('express')
const authMiddleware = require('../../middlewares/authMiddleware')
const cacheMiddleware = require('../../middlewares/cacheMiddleware')
const validationHandlerMiddleware = require('../../middlewares/validationHandlerMiddleware')
const asyncMiddleware = require('../../middlewares/asyncMiddleware')
const responseHandlerMiddleware = require('../../middlewares/responseHandlerMiddleware')
const validator = require('express-validator')
const validationSchema = require('./validation')
const {
    getAll,
    block,
    getByReference,
    save,
    search,
    getByUser
} = require('./controller')

const router = express.Router()

router.get('/:travelId',
    authMiddleware,
    validator.checkSchema(validationSchema.getAllSchema),
    validationHandlerMiddleware,
    cacheMiddleware.get,
    asyncMiddleware(async (req, res, next) => {

        const data = {
            ...req.params,
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

router.get('/getForUser',
    authMiddleware,
    asyncMiddleware(async (req, res, next) => {


        res.locals.data = await getByUser({id : res.locals.user._id})

        next()
    }),
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
    cacheMiddleware.customClear('/v1/travel'),
    cacheMiddleware.customClear('/v1/information'),
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
    cacheMiddleware.customClear('/v1/travel'),
    cacheMiddleware.customClear('/v1/information'),
    cacheMiddleware.clear,
    responseHandlerMiddleware
)


module.exports = router