import express from 'express'
import path, {
    join
} from "path"
import bodyParser from 'body-parser'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware.js'
import notFindMiddleware from './middlewares/notFindMiddleware.js'
import v1Router from './routers/v1/api_router.js'
import authRouter from './routers/v1/auth_router.js'
import {
    handleError
} from './utils/customError.js'

const app = express()
const port = process.env.PORT || 4152
const __dirname = path.resolve()

// Configuration

app.use(cors())

if (process.env.NODE_ENV === "production") {

    app.use(helmet())
    app.set('trust proxy',1)

}

if (process.env.NODE_ENV === "development") {

    app.use(morgan('dev'));

}

app.use(express.static(join(__dirname, '/uploads')));

app.use(express.static(join(__dirname, '/public')));


app.use(bodyParser.json({
    limit: '50mb'
}))


app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 500000
}));

//Path

app.use('/v1', authRouter, v1Router)
app.use(notFindMiddleware)
app.use(errorHandlerMiddleware)

// Handler

process.on('unhandledRejection', (reason, p) => {
    
    throw reason

})

process.on('uncaughtException', async (error) => {

    const isOperationalError = await handleError(error)
    if (!isOperationalError) process.exit(1)

})

// Lauch
app.listen(port);
console.log('LABBAIK SERVER API on port: ' + port);
console.log("NODE_ENV : ", process.env.NODE_ENV);