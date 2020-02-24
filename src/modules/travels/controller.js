const Travel = require('./model')
const Country = require('../countries/model')
const {getRemainingPlace} = require('../booking/controller')
const Promise = require('bluebird')
const moment = require('moment')


exports.getAll = async function getAll({
    offset = 0,
    limit = 5
}) {

    const dataArray = []

    const dataPromise = Travel.find()
        .skip(+offset)
        .limit(+limit)
        .sort('-date_departing')
        .populate({
            path: 'driving.bus',
            select: 'name capacity'
        })
        .lean()
        .cursor()
        .eachAsync(async function (doc) {

            if (doc) {

                const fromPromise = Country.aggregate([
                    {$unwind : '$towns'},
                    {$match : {
                        'towns._id' : doc.from
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

                const toPromise = Country.aggregate([
                    {$unwind : '$towns'},
                    {$match : {
                        'towns._id' : doc.to
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

                const passenger_number_availablePromise = getRemainingPlace({
                    travelId: doc._id
                })

                const [from, to, passenger_number_available] = await Promise.all([fromPromise, toPromise,passenger_number_availablePromise])
                
                let drivingFormated = []

                for (const item of doc.driving) {
                    
                    drivingFormated.push({
                        value : item.bus._id,
                        label : `${item.bus.name} (${item.bus.capacity})`
                    })
                }

                doc.id = doc._id
                doc.date_departing = moment(doc.date_departing).format("DD/MM/YYYY HH:mm")
                doc.date_arriving = moment(doc.date_arriving).format("DD/MM/YYYY HH:mm")
                doc.from = from.length > 0 ? from[0] : {value : '',label : ''}
                doc.to = to.length > 0 ? to[0] : {value : '',label : ''}
                doc.remaining_place = passenger_number_available.remainingPlace
                doc.passengers_already_get = passenger_number_available.passengerNumberAlreadyGet
                doc.driving = drivingFormated

                return dataArray.push(doc)

            }

            return null

        })
        .then(() => new Promise(resolve => resolve(dataArray)))

    const totalPromise = Travel.find()
        .countDocuments()
        .exec()

    const [data,total] = await Promise.all([dataPromise,totalPromise])

    return {
            total,
            data
        }

}

exports.search = async function search({
    offset = 0,
    limit = 5,
    to = '',
    from = '',
    date_departing = ''
}) {

    const dataArray = []
    
    const request = {
        
    }
    
    if(date_departing) {

        const dateDeparting = moment(date_departing,"DD/MM/YYYY").startOf('day')
        request.date_departing = {
            $gte : dateDeparting.toDate(),
            $lte : moment(dateDeparting).endOf('day').toDate()
        }
        
    }

    if(from) {
        request.from = from
    }

    if(to){
        request.to = to
    }

    const dataPromise = Travel.find(request)
        .skip(+offset)
        .limit(+limit)
        .sort('-date_departing')
        .populate({
            path: 'driving.bus',
            select: 'name capacity'
        })
        .lean()
        .cursor()
        .eachAsync(async function (doc) {

            if (doc) {

                const fromPromise = Country.aggregate([
                    {$unwind : '$towns'},
                    {$match : {
                        'towns._id' : doc.from
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

                const toPromise = Country.aggregate([
                    {$unwind : '$towns'},
                    {$match : {
                        'towns._id' : doc.to
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

                const passenger_number_availablePromise = getRemainingPlace({
                    travelId: doc._id
                })

                const [from, to, passenger_number_available] = await Promise.all([fromPromise, toPromise,passenger_number_availablePromise])
                
                let drivingFormated = []

                for (const item of doc.driving) {
                    
                    drivingFormated.push({
                        value : item.bus._id,
                        label : `${item.bus.name} (${item.bus.capacity})`
                    })
                }

                doc.id = doc._id
                doc.date_departing = moment(doc.date_departing).format("DD/MM/YYYY HH:mm")
                doc.date_arriving = moment(doc.date_arriving).format("DD/MM/YYYY HH:mm")
                doc.from = from.length > 0 ? from[0] : {value : '',label : ''}
                doc.to = to.length > 0 ? to[0] : {value : '',label : ''}
                doc.remaining_place = passenger_number_available.remainingPlace
                doc.passengers_already_get = passenger_number_available.passengerNumberAlreadyGet
                doc.driving = drivingFormated

                return dataArray.push(doc)

            }

            return null

        })
        .then(() => new Promise(resolve => resolve(dataArray)))

    const totalPromise = Travel.find(request)
        .countDocuments()
        .exec()

    const [data,total] = await Promise.all([dataPromise,totalPromise])

    return {
            total,
            data
        }

}

exports.block = async function block({
    id
}) {

    let dataGet = await Travel.findOne({
        _id: id
    }).exec()

    if (dataGet) {

        dataGet.status = dataGet.status === true ? false : true

        await dataGet.save()
    }


    return null

}

exports.save = async function save({
    id = null,
    driving,
    ...data
}) {
    console.log(data)
    data.date_departing = moment(data.date_departing,"DD/MM/YYYY HH:mm")
    data.date_arriving = moment(data.date_arriving,"DD/MM/YYYY HH:mm")

    if (!id) {

        const dataSaved = await new Travel(data).save()

        driving.forEach((value) => {

            dataSaved.driving.push(value)

        })

        await dataSaved.save()

        return null

    } else {

        data.driving = driving

        const dataSaved = await Travel.findOneAndUpdate({
            _id: id
        }, data, {
            new: true
        }).exec()

        return null

    }

}