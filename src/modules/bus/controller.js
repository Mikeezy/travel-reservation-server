import Bus from './model.js'


export async function getAll(status = false) {
    const request = {

    }
    
    if(status) request.status = true

    const data = await Bus.find(request)
        .sort('name')
        .exec()

    return data
}

export async function block({id}) {

    let dataGet = await Bus.findOne({
        _id: id
    }).exec()

    if(dataGet){

        dataGet.status = dataGet.status === true ? false : true

        await dataGet.save()
    }


    return null

}

export async function save ({id = null,...data}) {

    if(!id){

        const dataSaved = await new Bus(data).save()

        return dataSaved

    }else{

        const dataSaved = await Bus.findOneAndUpdate({
            _id : id
        },data,{
            new : true
        }).exec()

        return dataSaved

    }

}
