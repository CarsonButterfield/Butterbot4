const reply = async({ msg, content }) => {
  try {
    console.log({msg})
    msg.channel.send(content)
  } catch (err) {
    console.log(err)
  }
}

module.exports = reply