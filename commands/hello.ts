
const hello = (msg,args,client) => {
  const {channel,message} = args
  client.channels.get(channel).send(message)
}


export = hello