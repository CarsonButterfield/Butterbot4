const message = ({ msg , user , client }) => {
   client.fetchUser(user)
   .then(user => user.send(msg))
}

module.exports = message