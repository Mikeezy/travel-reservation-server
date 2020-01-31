import {successMessage} from '../utils/response.js'

export default function (req,res,next){

    const dataToReturn = successMessage(res.locals.data)
    return res.status(200).json(dataToReturn)

}