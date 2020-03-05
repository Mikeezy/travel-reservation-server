const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const errorHandlerMiddleware = require('./middlewares/errorHandlerMiddleware')
const notFindMiddleware = require('./middlewares/notFindMiddleware')
const v1Router = require('./routers/v1/api_router')
const authRouter = require('./routers/v1/auth_router')
const {
    handleError
} = require('./utils/customError')

const app = express()
const port = process.env.PORT || 4152

// Configuration

app.use(cors())

if (process.env.NODE_ENV === "production") {

    app.use(helmet())
    app.set('trust proxy', 1)

}

if (process.env.NODE_ENV === "development") {

    app.use(morgan('dev'));

}

app.use(express.static(path.join(__dirname, '/uploads')));

app.use(express.static(path.join(__dirname, '/public')));


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

    try {

        const isOperationalError = await handleError(error)
        if (!isOperationalError) process.exit(1)

    } catch (e) {

        process.exit(1)
        
    }

})

// Lauch
app.listen(port);
console.log(' SERVER API on port: ' + port);
console.log("NODE_ENV : ", process.env.NODE_ENV);