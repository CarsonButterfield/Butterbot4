//API COMMANDS
const express = require('express');
const router = express.Router()
const db = require('../Models')
const axios = require('axios')
//takes all the guilds the user is in, retrieved from the discord api and filters them by guilds the bot is in
const filterGuilds = (guilds, client) => {
    const combinedGuilds = []
    const members = {}

    guilds.forEach(guild => {
      if (client.guilds.has(guild.id)) {
        client.guilds.get(guild.id).members.forEach(member => {
          members[member.id] = {
            displayname: member.displayName,
            avatar: member.user.avatar 
          }
        })
        const allChannels = client.guilds.get(guild.id).channels
        const channelObj = Object.fromEntries(allChannels)
        combinedGuilds.push({
          ...guild,
          channels: channelObj,
          members
        })
      }
    })
  return combinedGuilds

}
router.post('/login', (req, res) => {
    const {tokenType, accessToken} = req.body
    //get the users account info
    axios.get('https://discordapp.com/api/users/@me', {
              headers: {
                  authorization: `${tokenType} ${accessToken}`
              }
          })
              .then(user => {
                  req.session.user = user.data
                  //get all the guilds the user is in
                  axios.get('https://discordapp.com/api/users/@me/guilds', {
              headers: {
                  authorization: `${tokenType} ${accessToken}`
              }
          }).then(guilds => {
            //filter the guilds by which ones the bot is in
           const mutualGuilds = filterGuilds(guilds.data,req.discord)
           console.log({mutualGuilds})
            res.status(200).json({user:user.data ,guilds:mutualGuilds })
          })
                 
              })
              .catch(console.error);
   
  })
  
  router.delete('/logout', (req, res) => {
    req.session.destroy()
    res.status(200).json({status:"success"})
  })


  router.get('/guild/:id/data',(req,res) =>{
    console.log(req.params)
    db.Guild.findOne({id:req.params.id}, (err, guild)=>{
      if (err) return res.status(500).json({status:500, message:err})
      res.status(200).json({guild})
    })
   
  })
  
  router.post('/command', async (req, res) => {
    console.log(req.body)
    const {command,...args} = req.body
    if (commands[command]) {
      try{
        commands[command]({...args,client})
        return res.status(200).json({
          msg: 'success',
          status: 200
        })
      }
      catch(err){
        console.log(err)
      }
    }
    return res.status(500).json({
      status: 500,
      err: "command not found"
    })
  })
  //API CUSTOM LISTENERS
  router.post('/listener',(req,res) => {
      const { response, guild, type, word } = req.body
      if(type === "message" ){
        guildMap[guild].events.message[word] = response
      }
      return res.status(201).json({status:201,msg:"Success"})
  })

  router.get('/userdata', async (req,res)=> {
    const user = req.discord.users.get(req.session.user.id)
    res.json({user})

  })


 module.exports = router