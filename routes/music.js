var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const cds = require('../models/cds')
const works = require('../models/works')

// 允许跨域
router.all('*', function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
})

// 连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/music')

// 数据库连接状态获取
mongoose.connection.on('connected', () => {
  console.log('connected')
})

mongoose.connection.on('error', () => {
  console.log('error')
})

mongoose.connection.on('disconnected', () => {
  console.log('disconnected')
})

// 模版返回体
function resInfo(err, res) {
  if (err) {
    res.json({
      status: 0,
      msg: err.message
    })
  } else {
    res.json({
      status: 2000,
      msg: 'success'
    })
  }
}

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// 获取所有专辑
router.get('/getCd', (req, res, next) => {
  cds.find().exec((err, data) => {
    if (err) {
      res.json({
        status: 0,
        msg: err.message
      })
    } else {
      res.json({
        status: 2000,
        msg: '',
        count: data.length,
        list: data
      })
    }
  })
})

// 根据id获取专辑信息
router.get('/getCdById', (req, res, next) => {
  let id = req.query.id

  if (id === '001') {
    cds.find().exec((err, data) => {
      if (err) {
        res.json({
          status: 0,
          msg: err.message
        })
      } else {
        res.json({
          status: 2000,
          msg: '',
          count: data.length,
          data: data
        })
      }
    })
  } else {
    cds.findOne({
      _id: req.query.id
    }).exec((err, data) => {
      if (err) {
        res.json({
          status: 0,
          msg: err.message
        })
      } else {
        res.json({
          status: 2000,
          msg: '',
          count: data.length,
          data: data
        })
      }
    })
  }
})

// 添加专辑
router.post('/addCd', (req, res, next) => {
  const cd = new cds({
    imgUrl: req.body.imgUrl,
    title: req.body.title
  })

  cd.save((err, docs) => {
    resInfo(err, res)
  })
})

// 删除专辑
router.delete('/delCd', (req, res, next) => {
  let id = req.query.id

  cds.deleteOne({
    _id: id
  }, (err, docs) => {
    resInfo(err, res)
  })
})

// 修改专辑
router.put('/putCd', (req, res, next) => {
  let body = req.body
  let id = body.id
  let imgUrl = body.imgUrl
  let title = body.title

  cds.updateOne({
    _id: id
  }, {
    imgUrl: imgUrl,
    title: title
  }, (err, raw) => {
    resInfo(err, res)
  })
})

// 在专辑中添加歌曲
router.post('/addSong', (req, res, next) => {
  let body = req.body
  let id = body.id

  cds.update({
    _id: id
  }, {
    $push: {
      musicList: {
        img: body.img,
        title: body.title,
        singer: body.singer,
        time: body.time,
        musicUrl: body.musicUrl,
        isFav: 0,
        count: 0
      }
    }
  }, (err, raw) => {
    resInfo(err, res)
  })
})

// 根据专辑与歌曲的id删除歌曲
router.delete('/delSong', (req, res, next) => {
  let query = req.query
  let id = query.id
  let cdId = query.cdId

  cds.update({
    _id: cdId
  }, {
    $pull: {
      musicList: {
        _id: id
      }
    }
  }, (err, raw) => {
    resInfo(err, res)
  })
})

// 获得工作用BGM
router.get('/getWorkBGM', (req, res, next) => {
  works.find().exec((err, data) => {
    if (err) {
      res.json({
        status: 0,
        msg: err.message
      })
    } else {
      res.json({
        status: 2000,
        msg: '',
        count: data.length,
        list: data
      })
    }
  })
})

// 添加工作用BGM
router.post('/addWorkBGM', (req, res, next) => {
  let body = req.body

  const work = new works({
    img: body.img,
    title: body.title,
    musicUrl: body.musicUrl,
    singer: body.singer,
    time: body.time,
    count: 0
  })

  work.save((err, docs) => {
    resInfo(err, res)
  })
})

// 删除工作用BGM
router.delete('/delWorkBGM', (req, res, next) => {
  let query = req.query
  let id = query.id

  works.deleteOne({
    _id: id
  }, (err, docs) => {
    resInfo(err, res)
  })
})

module.exports = router;