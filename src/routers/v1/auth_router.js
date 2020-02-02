import express from 'express'
import authRouter from '../../modules/users/auth_router.js'


const router = express.Router()

router.use((req, res, next) => {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    next()
})

router.use('/auth', authRouter)



export default router