import mongoose from 'mongoose'
import config from 'config'

mongoose.connect(`${config.get('DATABASE_URL')}`,{ useNewUrlParser: true,useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

export default mongoose;