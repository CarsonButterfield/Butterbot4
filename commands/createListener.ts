const createListener = ({ word, response, guild }) => {

  guild.commands[word] = response
}

export = createListener