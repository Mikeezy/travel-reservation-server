import mongoose from '../../config/database.js'

const Schema = mongoose.Schema;

let bookingSchema = new Schema({
    user : {type: Schema.Types.ObjectId, ref: 'user'},
    travel : {type: Schema.Types.ObjectId, ref: 'travel'},
    date_booking : { type: Date, default: Date.now },
    guest : Schema.Types.Mixed,
    isGuest : {type :Boolean, default:true},
    passenger_number : {type :Number, default:1},
    seat_number : [Number],
    bus : {type: Schema.Types.ObjectId, ref: 'bus'},
    reference : { type: String, trim: true }
},
{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});


export default mongoose.model('booking', bookingSchema)