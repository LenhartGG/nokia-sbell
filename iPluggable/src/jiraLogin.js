var request = require('request');
const domain = 'https://optics-jira.int.net.nokia.com';
var bodyData =  {
    "username": "",
    "password": ""
  }
var options = {
    method: 'POST',
    url: domain+'/rest/auth/1/session',
    auth: { username: 'email@example.com', password: '<api_token>' },
    headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
    },
    body:JSON.stringify(bodyData),
   rejectUnauthorized: false  // 忽略安全警告
};

function loginUser(username, password){
    this.username = username;
    this.password = password;
}

function getOptions(loginUser){
    options.auth.username = loginUser.username;
    options.auth.password = loginUser.password;
    bodyData.username = loginUser.username;
    bodyData.password = loginUser.password;     
    return options;
}

function login(options){
    // var op = getOptions(user);
    var promise = new Promise(function (resolve) {
        request(options, function (error, response, body) {
            var cookie_value = response['headers']['set-cookie'];
            for(var c in cookie_value) {
                if(cookie_value[c].indexOf("Expires") !== -1) {
                      cookie_value[c] = "";
                }
            }
            var statusCode = response.statusCode;
            var srcData = {
                error: error,
                body: body,
                // statusCode
            };
            if(cookie_value) {
                srcData.cookie_value = cookie_value;
            }
            srcData.statusCode = statusCode;
            console.log(JSON.stringify(srcData));
            resolve(srcData);
         });
    }, function (err) {
        if (err) {
            console.log("error : " + err);
        }
        resolve("Fail",null);
    });

    return promise;
}

function logout(options){
    var promise = new Promise(function(resolve){
        request(options, function(error, response, body){
            var statusCode = response.statusCode;
            var srcData = {
                error: error,
                body: body,
                // statusCode
            };
            srcData.statusCode = statusCode;
            console.log("---------------jiraRes---------------")
            console.log(JSON.stringify(srcData))
            
            resolve(srcData);
        })
    }, function (err) {
        if (err) {
            console.log("error : " + err);
        }
        resolve("Fail",null);
    })
    return promise;
}

exports.loginUser = loginUser;
exports.login = login;
exports.logout = logout;
exports.domain = domain;