var express = require('express');
var router = express.Router();
var mysqlconfig = require('../test/mysql.config')
const TABLE_NAME = mysqlconfig.tablename;
var jiraLogin = require("../src/jiraLogin");
var comm = require("../src/comm");
var request = require('request');
var cookie_value = "";

// test
var db = require("../test/mysql");
// var importCSV = require("../test/importCSV"); //导入csv文件中的用户信息时需要加载
var importCSV = require("../test/ipluggable_upload_03-23-2020.js"); //导入csv文件中的用户信息时需要加载
var mysql = require("../test/mysql"); //mysql
// var mysql = require("../test/transferData"); //transmitData
// 给 Total Capture 文件夹中的文件改名
var importFromTotal = require("../test/importFromTotal.js");

/* GET users listing. */
router.get('/', function (req, res, next) {
  try {
    res.render("users", { title: "iPluggable | users" });
    res.end()
  } catch (error) {
    console.log(error);
  }
});


// register
router.post('/register', function(req, res) {
  // 定义用户权限码 group
  //      0      1     2
  // 不允许登录 查看权限 拥有操作权限
  var body = req.body;
  // 通过该jira验证
  goJiraDetection((e, r, users)=>{
      // 记录登录信息
      enterLoginInfo(() => {
            // 通过ipluggable验证
            goIpluggableDection((results, fields) => {
                let fullname = results[0].fullname;
                let data = createSuccess({
                  ret_code: 1,
                  users: users,
                  fullname: fullname,
                  group: 1
                });
                res.json(data);
            }, (results, fields) => {
                let fullname = body.username;
                let data = createSuccess({
                  ret_code: 1,
                  users: users,
                  fullname: fullname,
                  group: 0
                });
                res.json(data);
            });

        }
      )
      
  }, (e, r, users) => {

      let data = createFailure();
      res.json(data)

  });

  
  // 记录登录信息
  function enterLoginInfo(callback){
    var user_name = body.username;
    var login_time = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    // let sql = "INSERT INTO ipuggable_loginfo(username,login_freq) VALUES("+user_name+", "+login_freq+") ON DUPLICATE KEY UPDATE username="+username+",login_freq="+login_freq;
    let sql = "INSERT INTO `ipluggable_loginfo`(`user_name`,`login_time`) VALUES("+"'"+user_name+"'"+", "+"'"+login_time+"'"+")";
    // console.log(sql);
    db.query(sql, function (results2, fields2) {
      console.log('插入成功')
      callback()
    })
  }
  
  // 通过该jira验证
  function goJiraDetection (resolve, reject){
    var options = {
      method: 'POST',
      url: jiraLogin.domain + "/rest/auth/1/session",
      headers: {
        // "Authorization":"Basic "+ auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "username": body.username,
        "password": body.password,
      }),
      json: {
        "username": body.username,
        "password": body.password,
      },
      rejectUnauthorized: false  // 忽略安全警告
    };
    request(options, function (e, r, users) {
      if ( r.statusCode == 200 ) {
        resolve(e, r, users);
      } else {
        reject(e, r, users);
      }
    });
  }
  
  // 通过ipluggable验证
  function goIpluggableDection(resolve, reject){
    let user_name = body.username;
    let sql = "SELECT * FROM `Ipluggable_users` where `user_name` = '"+ user_name +"';"
    db.query(sql, [], function (results, fields) {
      if ( results.length != 0 ) {
        // 库中存在该用户（操作权限）
        resolve(results, fields)
      } else {
        // 游客（查看权限）
        reject(results, fields)
      }
      
    });

  }

});

// 登录接口
router.post('/login', function (req, res) {
  var user = req.body;
  if (user) {
    var options = {
      method: 'POST',
      url: jiraLogin.domain + "/rest/auth/1/session",
      headers: {
        // "Authorization":"Basic "+ auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "username": user.username,
        "password": user.password,
      }),
      json: {
        "username": user.username,
        "password": user.password,
      },
      rejectUnauthorized: false  // 忽略安全警告
    };
    request(options, function (e, r, users) {
      var success = null;
      var failure = null;
      var statusCode = r.statusCode;
      if ( statusCode == 200 ) {

          // 将 tokenId 存储到数据库表 Login_user_group_table 中，每次从新登陆都会更新 tokenId
          var promise = new Promise(function (resolve, reject){
              if(users.session){
                let tokenId = users.session.value;
                let sql = "SELECT `id` FROM `Login_user` where `user_name` = '"+ user.username +"';"
                db.query(sql, [], function (results, fields) {
                  let user_id = results[0].id;
                  if ( !user_id ){
                    reject()
                  }
                  let sql = "UPDATE `Login_user_group_table` SET `token_id` = '"+tokenId+"' WHERE user_id = '"+user_id+"' and app_id = '"+user.appId+"';"
                  db.query(sql, function (results, fields) {
                    console.log("成功更新token");
                    resolve();
                  });
                });
              }
          });
          promise.then(function(){
              // 4表联查 user_name app_name group fullname
              let sql = "SELECT a.user_name, b.app_name, c.group, d.fullname " +
              "from `Login_user` as a, `Login_app_name` as b, `Login_group` as c, `Login_fullname` as d, `Login_user_group_table` as e "+
              "where e.user_id = a.id and e.app_id = b.id and e.group_id = c.id and e.fullname_id = d.id and "+
              "a.user_name = '"+ user.username +"' and b.id = '"+ user.appId + "' ;"
              db.query(sql, [], function (results, fields) {
                var group     = results[0].group;
                var fullname  = results[0].fullname;
                var app_name  = results[0].app_name;

                var success = createSuccess({
                  users: users,
                  group: group,
                  fullname: fullname,
                  app_name: app_name
                });

                var promise2 = new Promise((resolve, reject) => {
                  // let sql = "INSERT INTO tablename(username,login_freq) VALUES("+username+", "+login_freq+") ON DUPLICATE KEY UPDATE username="+username+",login_freq="+login_freq;
                  let sql = "SELECT * from `ipuggable_loginfo` WHERE `username` = "+username;
                  db.query(sql, [], function (results2, fields2) {
                    var curuser_name = results[0].username;
                    var curlogin_freq = results[0].login_freq;
                    curlogin_freq += curlogin_freq;

                    if ( curuser_name ) {
                      var sql = "UPDATE ipuggable_loginfo SET username = "+username+", login_freq = "+login_freq+" WHERE username = "+username;
                      db.query(sql, [], function (results2, fields2) {
                        resolve();
                      });
                    } else {

                      let sql = "INSERT INTO ipuggable_loginfo (username, login_freq) VALUES ("+user_name+", "+login_freq+")";
                      db.query(sql, [], function (results2, fields2) {
                        resolve();
                      });
                    }

                  });
                });
                promise2.then(() => {
                  res.json(success);
                })

                
              });
          }, function(){
              // 异常处理
              var failure = createFailure();
              res.json(failure);
          });
          
      } else {
          failure = createFailure('数据库表中不存在该用户id信息');
          res.json(failure);
      }
    });
  } else {
    res.json({ ret_code: 0, ret_msg: 'Sorry, the username or password is incorrect. Please check your username and password.' });
  }
});

function createSuccess(arg){
  return {
    ret_code: arg.ret_code || 1, 
    ret_msg: arg.users, 
    ret_data: {
      group: arg.group, 
      fullname: arg.fullname, 
      app_name: arg.app_name
    }
  }
};

function createFailure( message ){
  return { ret_code: 0, ret_msg: message || 'Sorry, the username or password is incorrect. Please check your username and password.' }
}

/**
 * 保存所有 jira response headers 中的 set-cookie，
 * @param {*} response 
 */
function setCookie(response){
  if( !response ){
    return null;
  }
  var cookie_value = response['headers']['set-cookie'];
  for(var c in cookie_value) {
      if(cookie_value[c].indexOf("Expires") !== -1) {
            cookie_value[c] = "";
      }
  }
  return cookie_value;
}

router.delete('/logout', function (req, res) {
  var user = req.body;
  if( user.username && user.password &&  req.headers ){
    var headers = req.headers;
    var session = JSON.parse(headers.tokenid);
    var options = {
      // delete 方法不需要传递data
      method: 'delete',
      url:jiraLogin.domain + "/rest/auth/1/session",
      headers: {
        'Cookie': session.name + '=' + session.value
      },
      body: JSON.stringify({
        "username": user.username,
        "password": user.password,
      }),
      json: {
        "username": user.username,
        "password": user.password,
      },
      // rejectUnauthorized: false  // 忽略安全警告
    }
  
    request(options, function (e, r, users) {
      var success = { ret_code:1, ret_msg: users, ret_status: r.statusCode};
      var failure = { ret_code:0, ret_msg: users, ret_status: r.statusCode};
      if( r.statusCode == 204 ){
          // console.log(JSON.stringify(success));
          res.json(success);
      } else {
          // console.log(JSON.stringify(failure));
          res.json(failure);
      }
    });
  } else {
    var failure = {ret_code:0}
    res.json(failure);
  }
  
});

// 保持登录
router.get('/currentuser', function (req, res) {
  var user    = req.query;
  var headers = req.headers;
  goJira({
    user: user, 
    headers: headers, 
    res: res
  });
  // goNode({
  //   user: user, 
  //   headers: headers, 
  //   res: res
  // });
});
function goJira(arg){
    var user = arg.user, headers = arg.headers, res = arg.res;
    var session = JSON.parse(headers.tokenid);
    var options = {
      // delete 方法不需要传递data
      method: 'GET',
      url:jiraLogin.domain + "/rest/auth/1/session", 
      headers: {
        "Content-Type": "application/json",
        "Cookie": session.name + '=' + session.value
      },
      
      body: JSON.stringify({
        "username": user.username,
        "password": user.password,
      }),
      json: {
        "username": user.username,
        "password": user.password,
      },
      dataType: 'json'
    };
  
    request(options, function (e, r, users) {
      // console.log(JSON.stringify({ ret_code:0, ret_msg: users, ret_status: r.statusCode}))
      var success = { ret_code:1, ret_msg: users, ret_status: r.statusCode};
      var failure = { ret_code:0, ret_msg: users, ret_status: r.statusCode};
      if( r.statusCode == 200 ){
          // console.log(JSON.stringify(success));
          res.json(success)
      } else {
          // console.log(JSON.stringify(failure));
          res.json(failure)
      }
    });
}
function goNode(arg){
  var user = arg.user, headers = arg.headers, res = arg.res;
  var session = JSON.parse(headers.tokenid);

}

var format = function(time, format){
  var t = new Date(time);
  var tf = function(i){return (i < 10 ? '0' : '') + i};
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
      switch(a){
          case 'yyyy':
              return tf(t.getFullYear());
              break;
          case 'MM':
              return tf(t.getMonth() + 1);
              break;
          case 'mm':
              return tf(t.getMinutes());
              break;
          case 'dd':
              return tf(t.getDate());
              break;
          case 'HH':
              return tf(t.getHours());
              break;
          case 'ss':
              return tf(t.getSeconds());
              break;
      }
  })
}

module.exports = router;
