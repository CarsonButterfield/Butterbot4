const mongoose = require('mongoose')

const DBURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/butterbot'

mongoose.connect(DBURI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('MongoDB connected...'))
    .catch((err) => console.log(`MongoDB connection error": ${err}`));

  module.exports = {
  MsgLog : require('./MsgLog'),
  Guild : require('./Guild'),
  VoiceLog : require ('./VoiceLog'),
}