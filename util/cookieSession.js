var cookieSession = require('cookie-session');
module.exports = {
  config : {
    name : 'session',
    keys : ['key1','key2'],
    maxAge : 1000 * 60 *30
  },
  setConfig(){
    cookieSession(this.config);
  },
  setSession (req,res){
    req.session.username = req.query.password;
    res.send({err:0})
  }
}