const mysql = require('mysql')
// module.exports = {
//   //数据库配置
//   config:{
//     host:'localhost',
//     port:'3306',
//     user:'root',
//     password:'123456',
//     database:'db1',
//   },
//   sqlConnect:function(sql,sqlArr,callBack){
//     var pool = mysql.createPool(this.config);
//     pool.getConnection((err,conn) => {
//       console.log('尝试连接');
//       if(err){
//         console.log('连接失败');
//         return;
//       }
//       conn.query(sql,sqlArr,callBack);
//       //释放连接
//       // conn.end();
//       conn.release();
//       // pool.releaseConnection(conn);

//     })
//   }
// }

var pool = mysql.createPool({
  host:'localhost',
  port:'3306',
  user:'root',
  password:'123456',
  database:'db1',
  dateStrings:true //数据库中时区正常，但node中时区为0时区，加上此行代码解决时区问题
})
var sqlConnect =  function (sql,sqlArr,callBack){
  pool.getConnection((err,conn)=>{
    if(err){
      console.log('连接出错');
    }else{
      console.log('尝试连接');
      conn.query(sql,sqlArr,callBack)
      conn.release();
    }
    
  })
}
module.exports = {
  sqlConnect,
}
