const mongoose = require('mongoose')
const db = require('../Models')

const nuke = (msg,args) => {
  db.Guild.deleteMany({},err =>{
    if (err) return console.log(err);
    console.log('deleted')
  })
}

module.exports = nuke ;