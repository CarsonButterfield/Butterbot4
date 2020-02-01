const msg = async({content,channel,client,msg}) => {
  if(msg) channel = msg.channel.id
  try {
    client.channels.get(channel).send(content)
  } catch (err) {
    console.log(err)
  }
}

module.exports = msg