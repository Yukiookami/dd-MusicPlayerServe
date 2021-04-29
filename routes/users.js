var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const cds = require('../models/cds')
const users = require('../models/users')

// 允许跨域
router.all('*', function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('user')
});

/**
 * 用户登录
 * 
 * @param {String} username 用户名
 * @param {String} password 密码
 */
router.post('/login', (req, res, next) => {
  let body = req.body

  let params = {
    username: body.username,
    password: body.password
  }

  users.findOne(params, (err, data) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message
      })
    } else {
      if (data) {
        res.json({
          status: 2000,
          msg: "sucess",
          data: {
            username: data.username,
            userId: data._id,
            icon: data.icon
          }
        })
      } else {
        res.json({
          status: 2,
          msg: "账号或者密码错误"
        })
      }
    }
  })
})

/**
 * 根据用户名返回用户id
 * 
 * @param {String} username 用户名
 * @returns {String} 用户id
 *  */ 
router.get('/getId', (req, res, next) => {
  let username = req.query.username

  users.findOne({
    username: username
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
        data: data
      })
    }
  })
})

/**
 * 添加用户信息
 * @param {String} username 用户名
 * @param {String} password 密码
 * @param {String} netCloUsername 网易云用户名
 * @param {String} netCloPassword 网易云密码
 *  */ 
router.post('/addUser', (req, res, next) => {
  let body = req.body
  users.findOne({username: body.username}).exec((err, data) => {
    if (data) {
      res.json({
        status: 1,
        msg: '用户已存在'
      })
    } else {
      const user = new users({
        icon: body.icon,
        username: body.username,
        password: body.password,
        netCloUsername: body.netCloUsername,
        netCloPassword: body.netCloPassword
      })
    
      user.save((err, docs) => {
        resInfo(err, res)
      })
    }
  })
})

/**
 * 修改用户信息
 * 
 * @param {String} userId 用户id
 * @param {String} username 用户名
 * @param {String} password 密码
 * @param {String} netCloUsername 网易云用户名
 * @param {String} netCloPassword 网易云密码
 *  */ 
router.put('/putUser', (req, res, next) => {
  let body = req.body

  let id = body.oldId
  let icon = body.icon
  let username = body.username
  let password = body.password
  let netCloUsername = body.netCloUsername
  let netCloPassword = body.netCloPassword

  users.update({
    _id: id
  }, {
    icon: icon,
    username: username,
    password: password,
    netCloUsername: netCloUsername,
    netCloPassword: netCloPassword
  }, (err, raw) => {
    resInfo(err, res)
  })
})

/**
 * 删除用户
 * 
 * @param {String} id
 */
router.delete('/delUser', (req, res, next) => {
  let id = req.query.id

  users.deleteOne({
    _id: id
  }, (err, docs) => {
    resInfo(err, res)
  })
})

/**
 * 获取用户所有歌曲
 * 
 * @param {String} userId 用户id
 *  */ 
router.get('/getUserAllSong', (req, res, next) => {
  console.log(req.query.id)

  users.findOne({
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
})

/**
 * 用户歌单歌曲添加
 * 
 * @param {String} songId 歌曲id
 * @param {String} userId 用户id
 *  */ 
router.post('/addSongUser', (req, res, next) => {
  let body = req.body
  let songId = body.songId
  let userId = body.userId
  let flag = false

  users.find({'musicList.oldId': songId}).exec((err, data) => {
    if (err) {
      res.json({
        status: 0,
        msg: err.message,
        result: ''
      })
    } else {
      if (data) {
        data.forEach(ele => {
          if (ele._id == userId) {
            ele.musicList.forEach(ele => {
              if (songId == ele.oldId) {
                flag = true
    
                res.json({
                  status: 1,
                  msg: '歌曲已存在'
                })
              }
            })
          }
        })
      }
    }

    if (!flag) {
      users.updateOne({
        _id: userId
      }, {
        $push: {
          musicList: {
            img: body.img,
            title: body.title,
            singer: body.singer,
            time: body.time,
            musicUrl: body.musicUrl,
            oldId: songId,
            isFav: 1,
            count: 0
          }
        }
      }, (err, raw) => {
        resInfo(err, res)
      })
    }
  })
})

/**
 * 用户歌单歌曲删除
 * 
 * @param {String} songId 歌曲id
 * @param {String} userId 用户id
 *  */ 
router.delete('/delSongUser', (req, res, next) => {
  let query = req.query
  let songId = query.songId
  let userId = query.userId

  users.updateOne({
    _id: userId
  }, {
    $pull: {
      musicList: {
        _id: songId
      }
    }
  }, (err, raw) => {
    resInfo(err, res)
  })
})

module.exports = router;
