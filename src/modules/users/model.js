import mongoose from '../../config/database.js'

const Schema = mongoose.Schema;

let userSchema = new Schema({
    firstname : {type :String, trim : true},
    lastname : {type :String, trim : true},
    phone_number : {type :String,unique:true,trim : true},
    email : {type :String, unique:true,trim : true},
    password : String,
    role : { type: String, enum: ['super admin', 'admin','manager','user','driver'], default: 'admin' },
    status : {type :Boolean, default:false},
    uuid : {type :String, unique:true},
    blocked : {type :Boolean, default:false},
    created_at : { type: Date, default: Date.now },
    driver : {
        picture : {type :String, trim : true},
        permit_number : {type :String, trim : true},
        cni: {type :String, trim : true},
    },
    bookings : [{type: Schema.Types.ObjectId, ref: 'booking'}]
},
{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});


userSchema.virtual('fullname').get(function(value, virtual, doc) {
    return `${this.lastname} ${this.firstname}`
})


export default mongoose.model('user', userSchema)