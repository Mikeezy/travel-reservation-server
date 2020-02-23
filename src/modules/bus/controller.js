const Bus = require('./model')
const Promise = require('bluebird')


exports.getAll = async function getAll({
    offset = 0,
    limit = 5,
    status = false
}) {
    const request = {

    }
    
    if(status) request.status = true

    const dataPromise = Bus.find(request)
        .skip(+offset)
        .limit(+limit)
        .sort('name')
        .exec()

    const totalPromise = Bus.find(request)
        .countDocuments()
        .exec()

    const [data,total] = await Promise.all([dataPromise,totalPromise])

    return {
        total,
        data
    }
}

exports.getAllForSelect = async function getAllForSelect() {
    
    const data = await Bus.aggregate([
        {$match : {
            status : true
        }},
        {$sort : {
            "name" : 1
        }},
        {$project : {
            _id : 0,
            value : "$_id",
            label : {
                $concat : ["$name"," ","(","$immatriculation_number",")"]
            }
        }}
    ])
    .exec()

    return data

}

exports.block = async function block({id}) {

    let dataGet = await Bus.findOne({
        _id: id
    }).exec()

    if(dataGet){

        dataGet.status = dataGet.status === true ? false : true

        await dataGet.save()
    }


    return null

}

exports.save = async function save ({id = null,...data}) {

    if(!id){

        const dataSaved = await new Bus(data).save()

        return null

    }else{

        const dataSaved = await Bus.findOneAndUpdate({
            _id : id
        },data,{
            new : true
        }).exec()

        return null

    }

}
