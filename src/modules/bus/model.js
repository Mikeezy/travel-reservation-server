import mongoose from '../../config/database.js'

const Schema = mongoose.Schema;

let busSchema = new Schema({
    name : {type :String, trim : true},
    immatriculation_number : {type :String, trim : true},
    capacity : {type :Number, trim : 1}
},{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

export default mongoose.model('bus', busSchema)