import rateLimit from 'express-rate-limit'
import redisStore from 'rate-limit-redis'
import client from '../utils/redis.js'

const store = new redisStore({
    client,
    expiry : 60 * 60
})

export function authLimiterMiddleware({
    max = 5,
    message = "Too many actions from you, please try again after an hour"
}) {

    const authLimiter = rateLimit({
        store: store,
        windowMs: 60 * 60 * 1000, // 1 hour window
        max, // start blocking after max requests
        delayMs: 0,
        message,
        handler: function rateLimiterCallback(req, res) {
            return res.status(200).json({
                success: false,
                code : 'LIMIT_API_CALL',
                message
            })
        },
        skipFailedRequests: true
    })

    return authLimiter

}

export function apiLimiterMiddleware({
    time = 15 * 60 * 1000,
    max = 5,
    message = "Too many actions from you, please try again after 15 minutes"
}) {

    const apiLimiter = rateLimit({
        store: store,
        windowMs: time, // time window
        max, // start blocking after max requests
        delayMs: 0,
        message,
        handler: function rateLimiterCallback(req, res) {
            return res.status(200).json({
                success: false,
                code : 'LIMIT_API_CALL',
                message
            })
        },
        skipFailedRequests: true
    })

    return apiLimiter

}