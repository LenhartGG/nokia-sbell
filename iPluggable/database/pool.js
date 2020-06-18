/**
 * create connection
*/
var mysql = require('mysql');
var async = require('async');
var fs = require('fs');
var db_config = {
    host: '135.252.218.128',
    user: 'webuser',
    password: 'web1830',
    database: 'VLMTest'
}
const mysqlPool = mysql.createPool(db_config);
var pool = new Pool();

function Pool(){
    this.excSingleSql = function(sql){
        return new Promise(function (resolve) {
                mysqlPool.getConnection(function (err, connection) {
                    connection.query(sql, function (err, res, fields) {
                        connection.release();
                        resolve(res,err);
                    });
                });
            }, function (err) {                
                resolve(res,err);
        });       
    };
    this.excSqlArrAsync = function(sqlJson){
        var results = {
            'response':{},
            'errArr':[]
        };
        var keys = Object.keys(sqlJson);
        var sqlArr = [];
        for (var key in sqlJson) {
            if (sqlJson.hasOwnProperty(key)) {
                var sqlEle = sqlJson[key];
                sqlArr.push(sqlEle);                
            }
        }
        return new Promise(function (resolve) {
            async.eachSeries(sqlArr, function (sql, callback) {
                mysqlPool.getConnection(function (err, connection) {
                    connection.query(sql, function (err, res, fields) {
                        connection.release();
                        if(res){
                            if(res instanceof Array){
                                if(res.length > 0){
                                    results.response[keys[sqlArr.indexOf(sql)]] = res;
                                }
                            }else{
                                results.response[keys[sqlArr.indexOf(sql)]] = res;
                            }
                        }
                        if(err){
                            results.errArr.push(err);
                        }
                        if(sqlArr.indexOf(sql) == sqlArr.length-1){
                            resolve(results.response,results.errArr);
                        }else{
                            callback(err, res);
                        }
                    });
                });
    
            }, function (err) {
                console.log("error ------------- "+err.stack);
                resolve(results.response,results.errArr);
            });
        });        
    };
}

module.exports = {
    pool: pool
};