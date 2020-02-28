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
    search,
    block,
    save
} = require('./controller')

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

router.post('/search',
    authMiddleware,
    validator.checkSchema(validationSchema.searchSchema),
    validationHandlerMiddleware,
    asyncMiddleware(async (req, res, next) => {


        const data = {
            ...req.body,
            ...req.query
        }

        res.locals.data = await search(data)

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
    cacheMiddleware.customClear('/v1/booking'),
    cacheMiddleware.customClear('/v1/information'),
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
    cacheMiddleware.customClear('/v1/booking'),
    cacheMiddleware.customClear('/v1/information'),
    cacheMiddleware.clear,
    responseHandlerMiddleware
)


module.exports = router