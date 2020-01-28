const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const MsgLogSchema = new Schema({
  user: String,
  channel: String,
  time: Date
});

const MsgLog = model('MsgLog', MsgLogSchema);


export = MsgLog