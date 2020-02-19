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

exports.getAllTowns = async function getAllTowns() {
    
    let dataArray = []

    const data = await Country.find({
            status : true
        })
        .lean()
        .cursor()
        .eachAsync(async function (doc) {

            if (doc) {
                
                doc.towns.forEach((town) => {

                    if(town.status) {

                        dataArray.push({
                            id : town._id,
                            name : `${town.name} (${doc.name})`
                        })

                    }

                })

                return null

            }

            return null

        })
        .then(() => new Promise(resolve => resolve(dataArray)))

        return data.sort((a,b) => {
            return a.name.localeCompare(b.name)
        })

    
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