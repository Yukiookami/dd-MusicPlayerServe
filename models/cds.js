const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  "imgUrl": String,
  "title": String,
  "musicList": [{
    "img": String,
    "title": String,
    "singer": String,
    "time": String,
    "musicUrl": String,
    "count": Number
  }]
})

module.exports = mongoose.model('cd', Schema)