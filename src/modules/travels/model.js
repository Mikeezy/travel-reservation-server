import mongoose from '../../config/database.js'

const Schema = mongoose.Schema;

let travelSchema = new Schema({
    name : { type: String, trim: true },
    from : {type: Schema.Types.ObjectId},
    to : {type: Schema.Types.ObjectId},
    price : {type :Number, default:0},
    date_departing : Date,
    date_arriving : Date,
    driving : [{
        bus : {type: Schema.Types.ObjectId, ref: 'bus'},
        driver : {type: Schema.Types.ObjectId, ref: 'user'}
    }]
},
{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});


export default mongoose.model('travel', travelSchema)