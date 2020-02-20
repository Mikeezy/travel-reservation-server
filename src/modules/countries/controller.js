const Country = require('./model')


exports.getAllCountry = async function getAllCountry({
    offset = 0,
    limit = 5,
    status = false
}) {
    const request = {

    }

    let select = '-towns'
    
    if(status) {
        request.status = true
        select += ' -status'
    }

    const dataPromise = await Country.find(request)
        .skip(+offset)
        .limit(+limit)
        .select(select)
        .sort('name')
        .exec()

    const totalPromise = Country.find(request)
        .countDocuments()
        .exec()

    const [data,total] = await Promise.all([dataPromise,totalPromise])

    return {
            total,
            data
        }

}

exports.getAllCountriesForSelect = async function getAllCountriesForSelect() {
    
    const data = await Country.aggregate([
        {$match : {
            status : true
        }},
        {$sort : {
            "name" : 1
        }},
        {$project : {
            _id : 0,
            value : "$_id",
            label : "$name"
        }}
    ])
    .exec()

    return data

    
}

exports.getAllTowns = async function getAllTowns() {
    
    const data = await Country.aggregate([
        {$match : {
            status : true,
            "towns.status" : true
        }},
        {$unwind : '$towns'},
        {$sort : {
            "towns.name" : 1
        }},
        {$project : {
            _id : 0,
            id : "$towns._id",
            name : {
                $concat : ["$towns.name"," ","(","$name",")"]
            }
        }}
    ])
    .exec()

    return data

    
}

exports.getAllTownsForSelect = async function getAllTownsForSelect() {
    
    const data = await Country.aggregate([
        {$match : {
            status : true,
            "towns.status" : true
        }},
        {$unwind : '$towns'},
        {$sort : {
            "towns.name" : 1
        }},
        {$project : {
            _id : 0,
            value : "$towns._id",
            label : {
                $concat : ["$towns.name"," ","(","$name",")"]
            }
        }}
    ])
    .exec()

    return data

    
}

exports.getAllTownsForFrontend = async function getAllTownsForFrontend({
    offset = 0,
    limit = 5
}) {
    
    const dataPromise = Country.aggregate([
        {$unwind : '$towns'},
        {$sort : {
            "towns.name" : 1
        }},
        {$project : {
            _id : 0,
            id : "$towns._id",
            name : "$towns.name",
            description : "$towns.description",
            status : "$towns.status",
            idCountry : {
                value : "$_id",
                label : "$name"
            }
        }},
        {$skip : +offset},
        {$limit : +limit}
    ])
    .exec()

    const totalPromise = Country.aggregate([
        {$unwind : '$towns'},
        {$group : {
            _id : null,
            total : {
                $sum : 1
            }
        }}
    ])
    .exec()

    const [data,total] = await Promise.all([dataPromise,totalPromise])

    return {
        total : total.length > 0 ? +total[0].total : 0,
        data
    }

    
}

exports.getAllTownByCountry = async function getAllTownByCountry({id,status = false}) {
    const request = {
        _id : id
    }

    let result = []

    let data = await Country.findOne(request).sort('towns.name').exec()

    if(status) {

        data = data.toObject()

        result = data.towns.filter((doc) => {
            return doc.status === true
        })

        return result
    }

    return data.towns
}

exports.blockCountry = async function blockCountry({id}) {

    let dataGet = await Country.findOne({
        _id: id
    }).exec()

    if(dataGet){

        dataGet.status = dataGet.status === true ? false : true

        await dataGet.save()
    }


    return null

}

exports.blockTown = async function blockTown({id}) {

    let dataGet = await Country.findOne({
        'towns._id': id
    },{'towns.$' : 1}).exec()

    if(dataGet){

        await Country.findOneAndUpdate({
            'towns._id' : id
        },{
            $set : {
                'towns.$.status' : dataGet.towns[0].status === true ? false : true
            }
        },{
            new : true
        }).exec()
    }


    return null

}

exports.saveCountry = async function saveCountry ({id = null,...data}) {

    if(!id){

        const dataSaved = await new Country(data).save()

        return null

    }else{

        const dataSaved = await Country.findOneAndUpdate({
            _id : id
        },data,{
            new : true
        }).exec()

        return null

    }

}

exports.saveTown = async function saveTown ({idCountry,...data}) {

    if(!data.id){

        await Country.findOneAndUpdate({
            _id : idCountry
        },{
            $push : {
                towns : data
            }
        },{
            new : true
        })

        return null

    }else{

        const dataToSave = {
            'name' : data.name,
            'description' : data.description || ''
        }

        await Country.findOneAndUpdate({
            _id : idCountry,
            'towns._id' : data.id
        },{
            $set : {
                'towns.$' : dataToSave
            }
        },{
            new : true
        }).exec()

        return null

    }

}