import mongoose from '../../config/database'

const Schema = mongoose.Schema;

let townSchema = new Schema({
    name : {type :String, trim : true},
    description : {type :String, trim : true}
},{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

export default mongoose.model('town', townSchema)