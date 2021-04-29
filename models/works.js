const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  "img": String,
  "title": String,
  "singer": String,
  "time": String,
  "musicUrl": String,
  "count": Number
})

module.exports = mongoose.model('work', Schema)