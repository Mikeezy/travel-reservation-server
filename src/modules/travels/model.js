const mongoose = require('../../config/database')

const Schema = mongoose.Schema;

let travelSchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    from: {
        type: Schema.Types.ObjectId
    },
    to: {
        type: Schema.Types.ObjectId
    },
    price: {
        type: Number,
        default: 0
    },
    date_departing: Date,
    date_arriving: Date,
    date_return: Date,
    status: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    driving: [{
        bus: {
            type: Schema.Types.ObjectId,
            ref: 'bus'
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


module.exports = mongoose.model('travel', travelSchema)