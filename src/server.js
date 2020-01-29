import express from 'express'
import path ,{ join } from "path"
import bodyParser from 'body-parser'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import customEnv from 'custom-env'
import {handleErrorMiddleware,logErrorMiddleware} from './middlewares/errorHandlers.js'
import notFindMiddleware from './middlewares/notFindMiddleware.js'
import v1Router from './routers/v1/router.js'

customEnv.env(true)

const app = express();
const port = process.env.PORT || 4152;
const __dirname = path.resolve();

// Configuration

app.use(cors())

if (process.env.NODE_ENV === "production") {

    app.use(helmet())

}

if (process.env.NODE_ENV === "development") {

    app.use(morgan('dev'));

}

app.use(express.static(join(__dirname, '/src/uploads')));

app.use(express.static(join(__dirname, '/src/public')));


app.use(bodyParser.json({
    limit: '500mb'
}))


app.use(bodyParser.urlencoded({
    limit: '500mb',
    extended: true,
    parameterLimit: 500000
}));

//Path

app.use('/v1',v1Router)

app.use(notFindMiddleware)
app.use(logErrorMiddleware)
app.use(handleErrorMiddleware)



// Lauch
app.listen(port);
console.log('LABBAIK SERVER API on port: ' + port);
console.log("NODE_ENV : ", process.env.NODE_ENV);