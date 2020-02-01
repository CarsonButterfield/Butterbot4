const mongoose = require('mongoose')
const { Schema , model } = mongoose

const voiceLogSchema = new Schema({
  user:String,
  channel:String,
  timeJoin:Date,
  timeLeave:Date,
})

const VoiceLog = model('VoiceLog',voiceLogSchema)

export default VoiceLog