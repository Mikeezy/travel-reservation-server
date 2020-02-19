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
    save
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
            status : true
        }

        res.locals.data = await getAll(data)

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

        res.locals.data = await getAll(data)

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


module.exports = router