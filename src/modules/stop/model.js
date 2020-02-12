const mongoose = require('../../config/database')

const Schema = mongoose.Schema;

let stopSchema = new Schema({
    travel: {
        type: Schema.Types.ObjectId,
        ref: 'travel'
    },
    map: [{
        longitude: {
            type: String,
            trim: true
        },
        latitude: {
            type: String,
            trim: true
        }
    }]
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});


module.exports = mongoose.model('stop', stopSchema)