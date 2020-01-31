import express from 'express'
import path ,{ join } from "path"
import bodyParser from 'body-parser'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import customEnv from 'custom-env'
import logErrorMiddleware from './middlewares/loggerMiddleware.js'
import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware.js'
import notFindMiddleware from './middlewares/notFindMiddleware.js'
import v1Router from './routers/v1/api_router.js'
import authRouter from './routers/v1/auth_router.js'

customEnv.env('development')

const app = express()
const port = process.env.PORT || 4152
const __dirname = path.resolve()

// Configuration


app.use(cors())

if (process.env.NODE_ENV === "production") {

    app.use(helmet())

}

if (process.env.NODE_ENV === "development") {

    app.use(morgan('dev'));

}

app.use(express.static(join(__dirname, '/uploads')));

app.use(express.static(join(__dirname, '/public')));


app.use(bodyParser.json({
    limit: '500mb'
}))


app.use(bodyParser.urlencoded({
    limit: '500mb',
    extended: true,
    parameterLimit: 500000
}));

//Path

app.use('/v1',authRouter,v1Router)
app.use(notFindMiddleware)
app.use(logErrorMiddleware)
app.use(errorHandlerMiddleware)



// Lauch
app.listen(port);
console.log('LABBAIK SERVER API on port: ' + port);
console.log("NODE_ENV : ", process.env.NODE_ENV);