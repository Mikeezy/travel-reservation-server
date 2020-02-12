const mongoose = require('mongoose')
const config = require('config')

mongoose.connect(`${config.get('DATABASE_URL')}`,{ useNewUrlParser: true,useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

module.exports = mongoose;