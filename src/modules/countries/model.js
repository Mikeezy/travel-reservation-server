const mongoose = require('../../config/database')

const Schema = mongoose.Schema;

let countrySchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    status: {
        type: Boolean,
        default: true
    },
    towns: [{
        name: {
            type: String,
            trim: true
        },
        status: {
            type: Boolean,
            default: true
        },
        description: {
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

module.exports = mongoose.model('country', countrySchema)