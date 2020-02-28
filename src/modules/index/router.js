const express = require('express')
const authMiddleware = require('../../middlewares/authMiddleware')
const cacheMiddleware = require('../../middlewares/cacheMiddleware')
const asyncMiddleware = require('../../middlewares/asyncMiddleware')
const responseHandlerMiddleware = require('../../middlewares/responseHandlerMiddleware')
const {
    getAllForFrontendDashboard
} = require('../booking/controller')

const router = express.Router()

router.use(authMiddleware)

router.get('/',
    cacheMiddleware.get,
    asyncMiddleware(async (req, res, next) => {

        res.locals.data = await getAllForFrontendDashboard()

        next()
    }),
    cacheMiddleware.set,
    responseHandlerMiddleware
)




module.exports = router