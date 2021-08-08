const Koa = require('koa')
const app = new Koa()
const cors = require('@koa/cors')
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const log4js = require('./utils/log4j')
const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const koajwt = require('koa-jwt')
const util = require('./utils/util')
const users = require('./routes/users')
const me = require('./routes/me')
const welcome = require('./routes/welcome')
const dotenv = require('dotenv')
dotenv.config('./env')

// error handler
onerror(app)

require('./config/db')

app.use(cors())
// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
app.use(require('koa-static')(__dirname + '/uploads'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  log4js.info(`get params:${JSON.stringify(ctx.request.query)}`)
  log4js.info(`post params:${JSON.stringify(ctx.request.body)}`)
  await next().catch((err) => {
    if (err.status == '401') {
      ctx.status = 200;
      ctx.body = util.fail('Token verification failed', util.CODE.AUTH_ERROR)
    } else {
      throw err;
    }
  })
})

app.use(koajwt({ secret: process.env.JWTTOKEN }).unless({
  path: [/^\/api\/users\/login/, /^\/api\/users\/register/, /^\/api\/welcome/]
}))

router.prefix("/api")

router.use(users.routes(), users.allowedMethods())
router.use(me.routes(), me.allowedMethods())
router.use(welcome.routes(), welcome.allowedMethods())
app.use(router.routes(), router.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  log4js.error(`${err.stack}`)
});

module.exports = app
