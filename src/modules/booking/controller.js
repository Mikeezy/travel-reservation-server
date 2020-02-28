const Booking = require('./model')
const Travel = require('../travels/model')
const Country = require('../countries/model')
const User = require('../users/model')
const {
    customError,
    customSimpleError
} = require('../../utils/customError')
const Promise = require('bluebird')
const mongoose = require('mongoose')
const {
    generateReference
} = require('../../utils/random')
const moment = require('moment')


exports.getAll = async function getAll({
    offset = 0,
    limit = 5,
    travelId
}) {

    const dataPromise = Booking.find({
            travel: travelId
        })
        .skip(+offset)
        .limit(+limit)
        .sort('-date_booking')
        .populate({
            path: 'seat_number.bus',
            select: 'name capacity immatriculation_number'
        })
        .populate({
            path: 'user',
            select: 'lastname firstname phone_number'
        })
        .lean()
        .exec()

    const totalPromise = Booking.find({
            travel: travelId
        })
        .countDocuments()
        .exec()

    const [data, total] = await Promise.all([dataPromise, totalPromise])

    return {
        total,
        data
    }

}

exports.getByReference = async function getByReference({
    reference
}) {

    let dataGet = {

    }

    const data = await Booking.findOne({
            reference
        })
        .sort('-date_booking')
        .populate({
            path: 'travel',
            select: '-status -created_at -driving'
        })
        .populate({
            path: 'seat_number.bus',
            select: 'name capacity immatriculation_number'
        })
        .populate({
            path: 'user',
            select: 'lastname firstname phone_number'
        })
        .lean()
        .cursor()
        .eachAsync(async function (doc) {

            if (doc) {

                const fromPromise = Country.findOne({
                    'towns._id': doc.travel.from
                }, {
                    'towns.$': 1
                }).select('name description').exec()

                const toPromise = Country.findOne({
                    'towns._id': doc.travel.to
                }, {
                    'towns.$': 1
                }).select('name description').exec()

                const [from, to] = await Promise.all([fromPromise, toPromise])


                doc.travel.from = from.towns[0]
                doc.travel.to = to.towns[0]

                return dataGet = {
                    ...doc
                }

            }

            return null

        })
        .then(() => new Promise(resolve => resolve(dataGet)))

    if (data._id) {

        return data

    }

    throw new customError('Référence invalide, veuillez réessayer svp !', 'REFERENCE_INVALID')

}

exports.getByUser = async function getByUser({
    id
}) {

    let dataArray = []

    const data = await User.findOne({
            _id: id
        })
        .select('bookings')
        .populate({
            path: 'bookings',
            select: 'date_booking reference travel',
            populate: {
                path: 'travel',
                select: 'name from to date_departing date_arriving price'
            }
        })
        .lean()
        .exec()


    if (data.bookings && data.bookings.length > 0) {

        for await (book of data.bookings) {

            const fromPromise = Country.findOne({
                'towns._id': book.travel.from
            }, {
                'towns.$': 1
            }).select('name').exec()

            const toPromise = Country.findOne({
                'towns._id': book.travel.to
            }, {
                'towns.$': 1
            }).select('name').exec()

            const [from, to] = await Promise.all([fromPromise, toPromise])

            dataArray.push({
                date_booking: book.date_booking,
                reference: book.reference,
                travel: {
                    name: book.travel.name,
                    from: from.towns[0].name,
                    to: to.towns[0].name,
                    date_departing: book.travel.date_departing,
                    date_arriving: book.travel.date_arriving,
                    price: book.travel.price
                }
            })

        }

        return dataArray

    } else {

        return []

    }

}

exports.block = async function block({
    id
}) {

    let dataGet = await Booking.findOne({
        _id: id
    }).exec()

    if (dataGet) {

        dataGet.status = dataGet.status === true ? false : true

        await dataGet.save()
    }


    return null

}

async function getRemainingPlace({
    travelId
}) {

    const passenger_number_alreadyGetPromise = Booking.aggregate([{
            $match: {
                travel: mongoose.Types.ObjectId(travelId),
                status: true
            }
        }, {
            $group: {
                _id: '$travel',
                total: {
                    $sum: '$passenger_number'
                }
            }
        }])
        .exec()

    const travelGetPromise = Travel.findOne({
            _id: travelId
        })
        .populate('driving.bus')
        .exec()

    const [travelGet, passenger_number_alreadyGet] = await Promise.all([travelGetPromise, passenger_number_alreadyGetPromise])


    const busCapacity = travelGet.driving.reduce((acc, curr) => {

        return acc + curr.bus.capacity

    }, 0)

    const remainingPlace = busCapacity - (passenger_number_alreadyGet.length > 0 ? +passenger_number_alreadyGet[0].total : 0)

    return {
        remainingPlace,
        busCapacity,
        passengerNumberAlreadyGet: passenger_number_alreadyGet.length > 0 ? +passenger_number_alreadyGet[0].total : 0,
        driving: travelGet.driving
    }

}

exports.getRemainingPlace = getRemainingPlace

exports.getAllForFrontendDashboard = async function getAllForFrontendDashboard() {

    const getDailyReservationPlacePromise = Booking.aggregate([{
                $match: {
                    date_booking: {
                        $gte: moment().startOf('day').toDate(),
                        $lte: moment().endOf('day').toDate()
                    },
                    status : true
                }
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: '$passenger_number'
                    }
                }
            }
        ])
        .exec()

    const getWeeklyReservationPlacePromise = Booking.aggregate([{
                $match: {
                    date_booking: {
                        $gte: moment().startOf('week').toDate(),
                        $lte: moment().endOf('week').toDate()
                    },
                    status : true
                }
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: '$passenger_number'
                    }
                }
            }
        ])
        .exec()

    const getMonthlyReservationPlacePromise = Booking.aggregate([{
                $match: {
                    date_booking: {
                        $gte: moment().startOf('month').toDate(),
                        $lte: moment().endOf('month').toDate()
                    },
                    status : true
                }
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: '$passenger_number'
                    }
                }
            }
        ])
        .exec()

    const getMonthlyTravelPromise = Travel.aggregate([{
                $match: {
                    date_departing: {
                        $gte: moment().startOf('month').toDate(),
                        $lte: moment().endOf('month').toDate()
                    },
                    status : true
                }
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: 1
                    }
                }
            }
        ])
        .exec()

    const [gDRP, gWRP, gMRP, gMT] = await Promise.all([getDailyReservationPlacePromise, getWeeklyReservationPlacePromise, getMonthlyReservationPlacePromise, getMonthlyTravelPromise])

    const dailyRsvt = gDRP.length > 0 ? +gDRP[0].total : 0
    const weeklyRsvt = gWRP.length > 0 ? +gWRP[0].total : 0
    const monthlyRsvt = gMRP.length > 0 ? +gMRP[0].total : 0
    const monthlyTrvl = gMT.length > 0 ? +gMT[0].total : 0

    return [dailyRsvt, weeklyRsvt, monthlyRsvt, monthlyTrvl]

}

exports.search = async function search({
    from,
    to,
    date_departing
}) {

    const dataArray = []
    const dateDeparting = moment(date_departing).startOf('day')

    const dataGet = await Travel.find({
            from,
            to,
            date_departing: {
                $gte: dateDeparting.toDate(),
                $lte: moment(dateDeparting).endOf('day').toDate()
            },
            status: true
        })
        .select('-status -created_at')
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

                const passenger_number_availablePromise = getRemainingPlace({
                    travelId: doc._id
                })

                const [from, to, passenger_number_available] = await Promise.all([fromPromise, toPromise, passenger_number_availablePromise])

                doc.from = from.towns[0]
                doc.to = to.towns[0]
                doc.remaining_place = passenger_number_available.remainingPlace
                doc.passengers_already_get = passenger_number_available.passengerNumberAlreadyGet

                return dataArray.push(doc)

            }

        })
        .then(() => new Promise(resolve => resolve(dataArray)))

    if (dataGet.length > 0) {

        return dataGet

    } else {

        throw new customError('Aucun voyage programé selon les paramètres entrés, veuillez réessayer svp !', 'NO_TRAVEL')

    }


}

async function getAvailableBus(passengerNumberAlreadyGet, allBus) {

    let sumCapacity = 0
    let sumCapacityNotAvailableBus = 0
    let availableBus = []

    allBus.forEach((value) => {

        sumCapacity += +value.bus.capacity

        if (sumCapacity > passengerNumberAlreadyGet) {

            availableBus.push(value)

        } else {

            sumCapacityNotAvailableBus += +value.bus.capacity

        }

    })

    return [sumCapacityNotAvailableBus, availableBus]

}

async function getRightPassengerNumber(index, sumCapacityNotAvailableBus, check) {

    if (check) {

        return index - sumCapacityNotAvailableBus

    } else {

        return index

    }

}

async function getRemainingPlaceByBus(totalRemaining, indexCurrentCapacity, allCapacity) {

    const allCapacitySaved = [...allCapacity]

    allCapacitySaved.splice(indexCurrentCapacity, 1)

    const otherCapacities = allCapacitySaved.reduce((acc, curr) => {

        return acc + (curr.bus.capacity)

    }, 0)

    return +totalRemaining - otherCapacities

}

exports.save = async function save({
    id = null,
    ...data
}) {

    if (!id) {

        const remainingInformations = await getRemainingPlace({
            travelId: data.travel
        })

        if (data.passenger_number > remainingInformations.remainingPlace) {

            throw new customError('Le nombre de place que vous souhaitez reserver est supérieur aux places disponibles, veuillez réessayer svp !', 'PASSENGER_NUMBER_INVALID')

        } else {

            const reference = await generateReference(Booking, 'reference', 10)

            const seat_number = []

            if (remainingInformations.driving.length > 0) {

                let [sumCapacityNotAvailableBus, availableBus] = await getAvailableBus(remainingInformations.passengerNumberAlreadyGet, remainingInformations.driving)

                let check = sumCapacityNotAvailableBus === 0 ? true : false

                let drivingEntries = Object.entries(availableBus)

                for (let i = 1; i <= data.passenger_number; i++) {

                    let sum = sumCapacityNotAvailableBus

                    let [indexDriving, dataGet] = drivingEntries.find(([index, value]) => {

                        sum += (+value.bus.capacity)

                        return sum >= (remainingInformations.passengerNumberAlreadyGet + i)
                    })

                    if (indexDriving > 0) {

                        let [
                            [indexTemp, dataGetTemp]
                        ] = drivingEntries.splice(0, 1)

                        sumCapacityNotAvailableBus += dataGetTemp.bus.capacity

                        availableBus.splice(0, 1)

                        remainingInformations.remainingPlace -= dataGetTemp.bus.capacity
                    }

                    seat_number.push({
                        number: (dataGet.bus.capacity - await getRemainingPlaceByBus(remainingInformations.remainingPlace, indexDriving > 0 ? (indexDriving - 1) : indexDriving, availableBus)) + await getRightPassengerNumber(i, sumCapacityNotAvailableBus, check),
                        bus: dataGet.bus._id
                    })



                }

            } else {

                throw new customSimpleError()

            }

            const guestKeys = Object.keys(data.guest || {})

            if (guestKeys.length === 0 && !data.user) {

                throw new customError(`Veuillez préciser si le client est un utilisateur ou un invité svp !`, 'PROVIDE_USER_OR_GUEST')

            } else if (guestKeys.length === 0 && data.user) {

                data.isGuest = false

            }

            data.seat_number = seat_number
            data.reference = reference

            const dataSaved = await new Booking(data).save()

            if (data.user && guestKeys.length === 0) {

                await User.findOneAndUpdate({
                    _id: data.user
                }, {
                    $push: {
                        bookings: dataSaved._id
                    }
                })

            }

            return dataSaved
        }


    } else {

        const dataSaved = await Booking.findOneAndUpdate({
            _id: id
        }, data, {
            new: true
        }).exec()

        return dataSaved

    }

}