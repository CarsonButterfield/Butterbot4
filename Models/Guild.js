const mongoose = require('mongoose')
const {Schema,model} = mongoose
const MsgLog = require('./MsgLog')
const VoiceLog = require('./VoiceLog')

const DServerSchema = new Schema({
  id:String,
  messageLogs:[],
  voiceLogs:[], 
})

const DServer = model('DServer', DServerSchema )

module.exports = DServer