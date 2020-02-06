import Travel from './model.js'
import Country from '../countries/model.js'
import Promise from 'bluebird'


export async function getAll() {

    const data = await Travel.find()
        .sort('-date_departing')
        .populate('driving.bus driving.driver')
        .cursor()
        .on('data', async function (doc) {

            const fromPromise = Country.findOne({
                'towns._id': doc.from
            }, {
                'towns.$': 1
            }).exec()

            const toPromise = Country.findOne({
                'towns._id': doc.to
            }, {
                'towns.$': 1
            }).exec()

            const [from, to] = await Promise.all([fromPromise, toPromise])

            doc.from = from.towns[0]
            doc.to = to.towns[0]

        })
        .exec()

    return data
}

export async function block({
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

export async function save({
    id = null,
    ...data
}) {

    if (!id) {

        const dataSaved = await new Travel(data).save()

        return dataSaved

    } else {

        const dataSaved = await Travel.findOneAndUpdate({
            _id: id
        }, data, {
            new: true
        }).exec()

        return dataSaved

    }

}