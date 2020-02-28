const express = require('express')
const userRouter = require('../../modules/users/router')
const countryRouter = require('../../modules/countries/country_router')
const townRouter = require('../../modules/countries/town_router')
const busRouter = require('../../modules/bus/router')
const travelRouter = require('../../modules/travels/router')
const bookingRouter = require('../../modules/booking/router')
const indexRouter = require('../../modules/index/router')

const router = express.Router()

router.use((req,res,next) => {
    
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    next()
    
})


router.use('/information',indexRouter)
router.use('/travel',travelRouter)
router.use('/booking',bookingRouter)
router.use('/user',userRouter)
router.use('/country',countryRouter)
router.use('/town',townRouter)
router.use('/bus',busRouter)



module.exports = router