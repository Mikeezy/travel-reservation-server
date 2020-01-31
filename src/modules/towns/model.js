import mongoose from '../../config/database.js'

const Schema = mongoose.Schema;

let countrySchema = new Schema({
    name : {type :String, trim : true},
    towns : [{
        name : {type :String, trim : true},
        description : {type :String, trim : true}
    }]
},{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

export default mongoose.model('country', countrySchema)