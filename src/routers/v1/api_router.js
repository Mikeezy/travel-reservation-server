import express from 'express'
import userRouter from '../../modules/users/router.js'
import countryRouter from '../../modules/countries/country_router.js'
import townRouter from '../../modules/countries/town_router.js'
import busRouter from '../../modules/bus/router.js'
import travelRouter from '../../modules/travels/router.js'
import bookingRouter from '../../modules/booking/router.js'

const router = express.Router()

router.use((req,res,next) => {
    
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    next()
    
})


router.use('/travel',travelRouter)
router.use('/booking',bookingRouter)
router.use('/user',userRouter)
router.use('/country',countryRouter)
router.use('/town',townRouter)
router.use('/bus',busRouter)



export default router