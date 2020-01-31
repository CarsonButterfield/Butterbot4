const Discord = require('discord.js')
const mongoose = require('mongoose')
const express = require('express')
const {scheduleJob} = require('node-schedule')
const bodyParser = require('body-parser')
const app = express()
const client = new Discord.Client()
//where the sorted final voice logs are stored before being sent to the db
const guildMap = {}
//where the users are stored when they are currently online, mapped based on there Discord user id 
const userMap = {}
const PORT = process.env.PORT || 4000

const config = require('./config.json')
const commands = require('./commands')
const db = require('./Models')

app.listen(PORT, () => console.log(`waiting for commands on port ${PORT}`))
app.use(bodyParser.json())

class voiceLog {
  id: String;
  timeJoined: Date;
  timeLeft: Date;
  voiceChannel: String
  constructor({
    id,
    timeJoined,
    timeLeft,
    voiceChannel
  }) {
    this.id = id,
      this.timeJoined = timeJoined,
      this.timeLeft = timeLeft,
      this.voiceChannel = voiceChannel
  }
}

//tracker functions
const makeUserLog = (user) => {
  const newLog = {
    id: user.id,
    timeJoined: Date.now(),
    voiceChannel: user.voiceChannelID

  }
  userMap[user.id] = newLog
}

const makeFinalLog = (userID, guildID) => {

  const finaLog = new voiceLog({
    ...userMap[userID],
    timeLeft: Date.now()
  })
  guildMap[guildID].voiceLogs.push(finaLog)
  delete userMap[userID]
}

// makes the guildmap for the voicelogs to be sorted into
const makeGuildmap = () => {
  for (let guild of client.guilds.array()) {
    guildMap[guild.id] = {
      voiceLogs:[],
      messageLogs:[],
      commands:{}
    }
  }

}
const showAllGuilds = async () => {
  try {
    const guilds = await db.Guild.find({})
    console.log(guilds)

  } catch (err) {
    console.log(err)
  }
}
const exportVoiceLogs = async () => {
  for (const guild in guildMap) {
    try {
      const dbGuild = await db.Guild.findOne({
        id: guild
      });
      if (dbGuild) {
        dbGuild.voiceLogs.push(...guildMap[guild].voiceLogs)
        dbGuild.save()
        guildMap[guild].voiceLogs = []
      } else {
        db.Guild.create({
          id: guild,
          voiceLogs: guildMap[guild].voiceLogs
        })
        guildMap[guild].voiceLogs = []
      }
    } catch (err) {
      console.log(err)
    }
  }
}

client.login(config.token)
client.on('ready', () => {
  makeGuildmap()
  console.log('client ready')
})

client.on('message', (msg) => {
let content = msg.content.split(' ')
content.foreach(word => {
  if(guildMap[msg.guild.id].commands[word]){
    const {cmd, ...args} = guildMap[msg.guild.id].commands[word]
    commands[cmd]({...args,client})
  }
  
})
})

scheduleJob({
  minute: 1
}, () => {
  exportVoiceLogs()
})

client.on('voiceStateUpdate', (oldMember, newMember) => {
  //checks whether its a user coming online or going offline
  //0 is a mute/unmute, should be ignored
  //1 is a channel change
  //2 is going offline
  //3 is coming online
  if (oldMember.voiceChannel) {
    if (newMember.voiceChannel) {
      //if the channelID's are the same it means it was just a mute/unmute
      if (oldMember.voiceChannelID === newMember.voiceChannelID) {
        return
      }
      //this checks if they changed channels but are still online
      else if (oldMember.voiceChannelID != newMember.voiceChannelID) {
        makeFinalLog(newMember.id, oldMember.guild.id)
        makeUserLog(newMember)
      }
    } else {
      makeFinalLog(newMember.id, oldMember.guild.id)
    }
  } else {
    makeUserLog(newMember)
  }
})


//API COMMANDS
app.post('/command', (req, res) => {
  const {command,...args} = req.body
  if (commands[command]) {
    commands[command]({...args,client})
    return res.status(200).json({
      msg: 'success',
      status: 200
    })
  }
  return res.status(500).json({
    status: 500,
    err: "command not found"
  })
})