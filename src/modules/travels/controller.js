const Travel = require('./model')
const Country = require('../countries/model')
const Promise = require('bluebird')



exports.getAll = async function getAll({
    offset = 0,
    limit = 5
}) {

    const dataArray = []

    const data = await Travel.find()
        .skip(+offset)
        .limit(+limit)
        .select('-created_at')
        .sort('-date_departing')
        .populate({
            path: 'driving.bus',
            select: 'name capacity'
        })
        .lean()
        .cursor()
        .eachAsync(async function (doc) {

            if (doc) {

                const fromPromise = Country.findOne({
                    'towns._id': doc.from
                }, {
                    'towns.$': 1
                }).select('name description').exec()

                const toPromise = Country.findOne({
                    'towns._id': doc.to
                }, {
                    'towns.$': 1
                }).select('name description').exec()

                const [from, to] = await Promise.all([fromPromise, toPromise])


                doc.from = from.towns[0]
                doc.to = to.towns[0]

                return dataArray.push(doc)

            }

            return null

        })
        .then(() => new Promise(resolve => resolve(dataArray)))


    return data
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