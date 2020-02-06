import Booking from './model.js'
import Travel from '../travels/model.js'
import {
    customError,
    customSimpleError
} from '../../utils/customError.js'
import Promise from 'bluebird'
import mongoose from 'mongoose'
import {generateReference} from '../../utils/random.js'


export async function getAll() {

    const data = await Booking.find()
        .sort('-date_booking')
        .populate('user travel bus')
        .exec()

    return data
}

export async function getByReference({
    reference
}) {

    const data = await Booking.findOne({
            reference
        })
        .sort('-date_booking')
        .populate('user travel bus')
        .exec()

    if(data) {

        return data

    }

    throw new customError('Référence invalide, veuillez réessayer svp !','REFERENCE_INVALID')

}

export async function block({
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

export async function getRemainingPlace({travelId}){

    const passenger_number_alreadyGetPromise = Booking.aggregate([{
        $match: {
            travel: mongoose.Types.ObjectId(travelId)
        }
    }, {
        $group: {
            _id: '$travel',
            total: {
                $sum: '$passenger_number'
            }
        }
    }]).exec()

    const travelGetPromise = Travel.findOne({
        _id : travelId,
        status: true
    })
    .populate('driving.bus')
    exec()

    const [travelGet, passenger_number_alreadyGet] = await Promise.all([travelGetPromise,passenger_number_alreadyGetPromise])

    const busCapacity = travelGet.driving.reduce((acc,curr) => {
        
        return acc + curr.bus.capacity

    },0)

    const remainingPlace = busCapacity - (+passenger_number_alreadyGet.total || 0)

    return {
        remainingPlace,
        busCapacity,
        passengerNumberAlreadyGet : passenger_number_alreadyGet.total,
        driving : travelGet.driving
    }

}

export async function save({
    id = null,
    ...data
}) {

    if (!id) {

        const remainingInformations = await getRemainingPlace({travelId : data.travel})

        if(data.passenger_number > remainingInformations.remainingPlace){

            throw new customError('Le nombre de place que vous souhaitez reserver est supérieur aux places disponibles, veuillez réessayer svp !','PASSENGER_NUMBER_INVALID')

        }else{

            const reference = await generateReference(Booking,'reference',10)

            const seat_number = []

            const bus = {}

            if(remainingInformations.driving.length === 1){

                bus = remainingInformations.driving[0].bus

                for(let i = 1; i<= data.passenger_number; i++){

                    seat_number.push((bus.capacity - remainingInformations.remainingPlace) + i)

                }

            }else if(remainingInformations.driving.length > 1){

                let sum = 0

                // because here the result will be {bus,driver}
                const dataGet = remainingInformations.driving.find((value) => {
                    
                    sum = sum + (+value.bus.capacity)

                    return sum > remainingInformations.passengerNumberAlreadyGet
                })

                //So I have to pick up the right attribute
                bus = dataGet.bus

                for(let i = 1; i<= data.passenger_number; i++){

                    seat_number.push((bus.capacity - remainingInformations.remainingPlace) + i)

                }

            }else{

                throw new customSimpleError()

            }

            if(!data.guest && !data.user){

                throw new customError(`Veuillez préciser si le client est un utilisateur ou un invité svp !`,'PROVIDE_USER_OR_GUEST')

            }else if(!data.guest && data.user) {

                data.isGuest = false

            }

            data.seat_number = seat_number
            data.reference = reference
            data.bus = bus._id

            const dataSaved = await new Booking(data).save()
    
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