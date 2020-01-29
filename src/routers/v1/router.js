import express from 'express'
import userRouter from '../../modules/users/router.js'

const router = express.Router()

router.use((req,res,next) => {
    
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    next()

})

router.use(userRouter)



export default router