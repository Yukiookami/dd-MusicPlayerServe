const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  "icon": String,
  "username": String,
  "password": String,
  "netCloUsername": String,
  "netCloPassword": String,
  "musicList": [{
    "img": String,
    "title": String,
    "singer": String,
    "time": String,
    "musicUrl": String,
    "count": Number,
    "oldId": String
  }]
})

module.exports = mongoose.model('user', Schema)