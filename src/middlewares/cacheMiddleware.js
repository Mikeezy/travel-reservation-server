import client from '../utils/redis.js'
import {successMessage} from '../utils/response.js'

const ttl = 15 * 60

function getKeyFromRequest(req) {

    let key = req.originalUrl

    return key
}

async function get(req, res, next) {

    const key = getKeyFromRequest(req)

    const data = await client.getAsync(key)

    if(data) {

        const dataToReturn = successMessage(data)
        return res.status(200).json(dataToReturn)

    }

    return next()

}

async function set(req, res, next) {

    const key = getKeyFromRequest(req)

    await client.setAsync(key,res.locals.data,'EX',ttl)

    return next()

}

async function clear (req,res,next) {

    const keysToDelete = req.baseUrl
    const dataToDelete = await client.keysAsync(`${keysToDelete}*`)

    client.del(dataToDelete)

    return next()

}

export default {
    get,
    set,
    clear
}