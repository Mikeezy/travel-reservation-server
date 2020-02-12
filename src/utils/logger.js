const winston = require('winston')
const moment = require('moment')
const {
    combine,
    timestamp,
    colorize,
    printf,
    json
} = winston.format

const myFormat = printf(({
    level,
    message
}) => {
    return `\n${moment().format('DD/MM/YYYY HH:mm:ss')} - ${level}\n ${message}\n`;
});


const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: combine(
                colorize(),
                myFormat
            )
        }),
        new winston.transports.File({
            filename: './src/logs/combined.log',
            level : 'info',
            format : combine(
                timestamp(),
                json()
            )
        }),
        new winston.transports.File({
            filename: './src/logs/error.log',
            level : 'error',
            format : combine(
                timestamp(),
                json()
            )
        })
    ],
    exitOnError : false
});

module.exports = logger