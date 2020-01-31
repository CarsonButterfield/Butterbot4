const msg = async({content,channel,client}) => {
  try {
    client.channels.get(channel).send(content)
  } catch (err) {
    console.log(err)
  }
}

export = msg