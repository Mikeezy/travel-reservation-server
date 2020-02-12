const mongoose = require('../../config/database')

const Schema = mongoose.Schema;

let busSchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    immatriculation_number: {
        type: String,
        trim: true
    },
    capacity: {
        type: Number,
        default: 2
    },
    status: {
        type: Boolean,
        default: true
    },
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

module.exports = mongoose.model('bus', busSchema)