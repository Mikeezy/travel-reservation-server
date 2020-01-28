import mongoose from 'mongoose'

mongoose.connect(`${process.env.DATABASE_URL}`,{ useNewUrlParser: true,useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

export default mongoose;