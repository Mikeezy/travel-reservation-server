import Country from './model.js'


export async function getAllCountry(status = false) {
    const request = {

    }

    let select = '-towns'
    
    if(status) {
        request.status = true
        select += ' -status'
    }

    const data = await Country.find(request)
        .select(select)
        .sort('name')
        .exec()

    return data
}

export async function getAllTownByCountry({id,status = false}) {
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

export async function blockCountry({id}) {

    let dataGet = await Country.findOne({
        _id: id
    }).exec()

    if(dataGet){

        dataGet.status = dataGet.status === true ? false : true

        await dataGet.save()
    }


    return null

}

export async function blockTown({id}) {

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

export async function saveCountry ({id = null,...data}) {

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

export async function saveTown ({idCountry,...data}) {

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