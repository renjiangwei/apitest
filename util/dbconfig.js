const mysql = require('mysql')
module.exports = {
  //数据库配置
  config:{
    host:'localhost',
    port:'3306',
    user:'root',
    password:'123456',
    database:'db1',
  },
  sqlConnect:function(sql,sqlArr,callBack){
    var pool = mysql.createPool(this.config);
    pool.getConnection((err,conn) => {
      console.log('尝试连接');
      if(err){
        console.log('连接失败');
        return;
      }
      conn.query(sql,sqlArr,callBack);
      //释放连接
      conn.release();
    })
  }
}