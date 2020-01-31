import NodeCache from 'node-cache'
import {successMessage} from '../utils/response.js'

const cache = new NodeCache({
    stdTTL: +process.env.CACHE_TTL || 5 * 60
})

function getKeyFromRequest(req) {

    let key = req.originalUrl

    return key
}

function get(req, res, next) {

    const key = getKeyFromRequest(req)

    const data = cache.get(key)

    if(data) {

        const dataToReturn = successMessage(data)
        return res.status(200).json(dataToReturn)

    }

    return next()

}

function set(req, res, next) {

    const key = getKeyFromRequest(req)

    cache.set(key,res.locals.data)

    return next()

}

function clear (req,res,next) {

    let keysCached = cache.keys()
    const keysToDelete = req.baseUrl

    let dataToDelete = keysCached.filter(k => k.includes(keysToDelete))

    cache.del(dataToDelete)

    return next()

}

export default {
    get,
    set,
    clear
}