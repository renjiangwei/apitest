const express = require('express')
const app = express()
const port = 3000
const userRouter = require('./routes/user')
const indexRouter = require('./routes/index')
const depRouter = require('./routes/dep')
const courseRouter = require('./routes/course')
const noticeRouter = require('./routes/notice')
const homeworkRouter = require('./routes/homework')
const questionRouter = require('./routes/question')

const cors = require('./util/cors')//没用
const bodyParser = require('body-parser')
// app.use(express.json()) 
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())



//千万注意session使用要放在路由前面，否则路由里不能用req.session
var cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'user',
  keys: ['key1'],
  maxAge: 1000 * 60 * 30,
  httpOnly:false //true的话cookie不能被vue-cookies获取
}))
app.use('/user',userRouter)//挂载在/user子路由下
app.use('/', indexRouter)//挂载在/ 下
app.use('/dep',depRouter)//挂载在/dep路由下
app.use('/course',courseRouter)
app.use('/notice',noticeRouter)
app.use('/homework',homeworkRouter)
app.use('/question',questionRouter)


// app.all('*', (req, res, next) => {//cors封装响应头设置 解决跨域问题
//   cors.setHeader(req, res, next);
// });
// app.all('/', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });


// app.get('/aa', (req, res) => {
//   req.session.username = req.query.password;
//   console.log(req.session.username);
//   res.send({ err: 0 })
// })
// app.post('/aaa',(req,res)=>{
//   let {id,password} = req.body;
//   req.session.id = password;
//   res.send({ err: 0})
// })

app.get("/getInfo", (req, res) => {
  //判断是否有对应的session
  if (req.session.id) {
    res.send({ message: "数据信息" })
  } else {
    res.send({ message: "请先登录" })
  }
});

// app.get("/logout", (req, res) => {
//   //删除session
//   req.session.username = null;
//   res.send({ message: "退出成功" })
// });
// app.get('/', (req, res) => res.send('Hello World!'))
// app.post('/', (req, res) => {
//   console.log('收到请求体：',req.body)
//   res.status(201).send()
// })
app.listen(port, () => console.log(`Example app listening on port ${port} !`))