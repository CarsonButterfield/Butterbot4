//API COMMANDS
const express = require('express');
const router = express.Router()
const axios = require('axios')
router.post('/login', (req, res) => {
    const {tokenType, accessToken} = req.body
    axios.get('https://discordapp.com/api/users/@me', {
              headers: {
                  authorization: `${tokenType} ${accessToken}`
              }
          })
              .then(response => {
                  req.session.user = response.data
                  console.log(response)
                  res.status(200).json(response.data)
              })
              .catch(console.error);
   
  })
  
  router.delete('/logout', (req, res) => {
    req.session.destroy()
    res.status(200)
  })
  router.get('/testsession',(req,res) =>{
    console.log(req.discord)
   return res.status(200).json({sesh:req.session})
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

  router.get('/user', async (req,res)=> {
      console.log('beep')
    const user = req.discord.users.get(req.session.user.id)
    user.send("Yo")
    res.json({user})

  })
 module.exports = router