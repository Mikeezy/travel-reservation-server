import mongoose from 'mongoose'
import {get} from "./config.js"

const Config = get(process.env.NODE_ENV)

mongoose.connect(`${Config.DATABASE_URL}`,{ useNewUrlParser: true,useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

export default mongoose;