/**
 * User management
 */
const router = require('koa-router')()
const User = require('./../models/userSchema')
const Counter = require('./../models/counterSchema')
const util = require('./../utils/util')
const jwt = require('jsonwebtoken')
const log4js = require('./../utils/log4j')
const md5 = require('md5')
router.prefix('/users')

// User login
router.post('/login', async (ctx) => {
  try {
    const { userEmail, userPwd } = ctx.request.body;
    /**
     * 1. 'userId userName userEmail'
     * 2. {userId:1,_id:0}
     * 3. select('userId')
     */
    const res = await User.findOne({
      userEmail,
      userPwd: md5(userPwd)
    }, 'userId userName userEmail')

    if (res) {

      const data = res._doc;

      const token = jwt.sign({
        data
      }, process.env.JWTTOKEN, { expiresIn: '24h' })
      data.token = token;
      ctx.body = util.success(data)
    } else {
      ctx.body = util.fail("You entered an incorrect email or password")
    }
  } catch (error) {
    ctx.body = util.fail(error.msg)
  }
})

router.post('/login/popup', async (ctx) => {
  try {
    const { userEmail, userName } = ctx.request.body;
    /**
     * 1. 'userId userName userEmail'
     * 2. {userId:1,_id:0}
     * 3. select('userId')
     */
    const res = await User.findOne({
      userEmail
    }, 'userId userName userEmail')

    if (res) {
      const data = res._doc;
      const token = jwt.sign({
        data
      }, process.env.JWTTOKEN, { expiresIn: '24h' })
      data.token = token;
      ctx.body = util.success(data)
    } else {
      const doc = await Counter.findOneAndUpdate({ _id: 'userId' }, { $inc: { sequence_value: 1 } }, { new: true })
      try {
        const user = new User({
          userId: doc.sequence_value,
          userEmail,
          userName,
        })
        await user.save();
        let data = JSON.parse(JSON.stringify(user))
        delete data.userPwd;
        const token = jwt.sign({
          data
        }, process.env.JWTTOKEN, { expiresIn: '24h' })
        data.token = token;
        ctx.body = util.success(data)
      } catch (error) {
        ctx.body = util.fail(error.stack, 'Login failed');
      }
    }
  } catch (error) {
    ctx.body = util.fail(error.msg)
  }
})

// User register
router.post('/register', async (ctx) => {
  const { userEmail, userPwd } = ctx.request.body;
  if (!userEmail || !userPwd) {
    ctx.body = util.fail('Input error', util.CODE.PARAM_ERROR)
    return;
  }
  
  const res = await User.findOne({ userEmail }, '_id userName userEmail')
  if (res) {
    ctx.body = util.fail(`Duplicate user exist: ${res.userEmail}`)
  } else {
    const doc = await Counter.findOneAndUpdate({ _id: 'userId' }, { $inc: { sequence_value: 1 } }, { new: true })
    try {
      const user = new User({
        userId: doc.sequence_value,
        userEmail,
        userPwd: md5(userPwd),
        userName: '',
      })
      await user.save();
      let data = JSON.parse(JSON.stringify(user))
      delete data.userPwd;
      const token = jwt.sign({
        data
      }, process.env.JWTTOKEN, { expiresIn: '24h' })
      data.token = token;
      ctx.body = util.success(data, 'User created successfully')
    } catch (error) {
      ctx.body = util.fail(error.stack, 'User creation failed');
    }
  }
})

module.exports = router
