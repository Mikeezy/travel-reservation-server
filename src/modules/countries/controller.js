import Country from './model.js'


export async function getAllCountry(status = false) {
    const request = {

    }
    
    if(status) request.status = true

    const data = await Country.find(request)
        .select('-towns')
        .sort('name')
        .exec()

    return data
}

export async function getAllTownByCountry({id,status = false}) {
    const request = {
        _id : id
    }

    if(status) request['towns.status'] = true

    const data = await Country.findOne(request).sort('towns.name').exec()

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

        dataGet.towns[0].status = dataGet.towns[0].status === true ? false : true
        
        await dataGet.save()
    }


    return null

}

export async function saveCountry ({id = null,...data}) {

    if(!id){

        const dataSaved = await new Country(data).save()

        return dataSaved

    }else{

        const dataSaved = await Country.findOneAndUpdate({
            _id : id
        },data,{
            new : true
        }).exec()

        return dataSaved

    }

}

export async function saveTown ({idCountry,...data}) {

    if(!data.id){

        const dataSaved = await Country.findOneAndUpdate({
            _id : idCountry
        },{
            $push : {
                towns : data
            }
        },{
            new : true
        })

        return dataSaved

    }else{

        const dataToSave = {
            'towns.0.name' : data.name,
            'towns.0.description' : data.description
        }

        const dataSaved = await Country.findOneAndUpdate({
            'towns._id' : data.id
        },dataToSave,{
            new : true
        })

        return dataSaved

    }

}