/**
 * 运用node的文件系统模块批量修改文件名
 * 
 */

// 引入fs文件处理模块
var mysql = require('mysql');
var fs = require("fs");
var path = 'TotalCapture';

// 1 改变后台文件的命名 保存路径 TotalCapture，然后手动复制到upload文件夹下
// 使用 node importFromTotal.js 运行
// changefilename();

// 2.将文件名传入数据库 Ipluggable 或者 Ipluggable_test
// 使用 node importFromTotal.js 运行
// savetoDatabase()

// 3.将ipluggable表中??乱码替换成±
// 直接 f5 运行
// solveErrorCoding()

function changefilename(){
    fs.readdir(path, function(err, files) {
    
        // files是名称数组
        files.forEach(function(filename) {
            //运用正则表达式替换oldPath中不想要的部分
            var oldPath = path + '/' + filename,
            newArr = filename.split('_');
            newPath = path + '/' + newArr[1] + '_' + newArr[2];
            // fs.rename(oldPath, newPath, callback) 
            fs.rename(oldPath, newPath, function(err) {
                if (!err) {
                    console.log(filename + '副本替换成功!')
                } 
            })
        })
    })

}
function savetoDatabase(){
    
    var con = mysql.createConnection({
        host: '135.252.218.128',
        user: 'webuser',
        password: 'web1830',
        database: 'VLMTest'
    });
    
    fs.readdir(path, function(err, files) {
    
        // UPDATE categories 
        //     SET dingdan = CASE id 
        //         WHEN 1 THEN 3 
        //         WHEN 2 THEN 4 
        //         WHEN 3 THEN 5 
        //     END, 
        //     title = CASE id 
        //         WHEN 1 THEN 'New Title 1'
        //         WHEN 2 THEN 'New Title 2'
        //         WHEN 3 THEN 'New Title 3'
        //     END
        // WHERE id IN (1,2,3)

        
        var field1 = "SET Link3 = case APN ";
        var field2 = "Link4 = case APN ";
        var field3 = "Link5 = case APN ";
        var field4 = "Link6 = case APN ";
        var field5 = "Link7 = case APN ";
        // files是名称数组
        files.forEach(function(filename) {
            var newArr = filename.split('_');
            var APN = newArr[0];
            var number = newArr[1].split('.')[0];
            
            
            if(number == '1'){
                link = 'Link3';
                field1 += " WHEN '"+APN+"' THEN "+"'"+filename+"'";
            }
            if(number == '2'){
                link = 'Link4';
                field2 += " WHEN '"+APN+"' THEN "+"'"+filename+"'";
            }
            if(number == '3'){
                link = 'Link5';
                field3 += " WHEN '"+APN+"' THEN "+"'"+filename+"'";
            }
            if(number == '4'){
                link = 'Link6';
                field4 += " WHEN '"+APN+"' THEN "+"'"+filename+"'";
            }
            if(number == '5'){
                link = 'Link7';
                field5 += " WHEN '"+APN+"' THEN "+"'"+filename+"'";
            }
        });
        var sql = "UPDATE `Ipluggable` "+ field1 +" end, "+ field2 +" end, "+ field3 +" end, "+ field4 +" end, "+ field5 +" end ";

        con.connect(function(err) {
            if (err) throw err;
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log(result.affectedRows + " record(s) updated");
            });
        });
    
    })
}

function solveErrorCoding(){
    
    var con = mysql.createConnection({
            host: '135.252.218.128',
            user: 'webuser',
            password: 'web1830',
            database: 'VLMTest'
    });

    var sql = "SELECT id, BitRate from `Ipluggable` where `BitRate` like '%%??%%'"
    con.connect(function(err) {
        if (err) throw err;
        con.query(sql, function (err, result1) {
            if (err) throw err;
            result1 = JSON.stringify(result1);//把results对象转为字符串，去掉RowDataPacket
            result1 = JSON.parse(result1);
            // console.log(result);
            var sql = createSQL(result1)
            console.log(sql);
            con.query(sql, function (err, result2) {
                if (err) throw err;
                console.log(result2.affectedRows + " record(s) updated");
            })
            
        });
    });

}

function createSQL(result){
    var sql = "UPDATE Ipluggable ";
    var field = " SET BitRate = case id ";
    var where = " WHERE id IN (";
    result.forEach(function(ele, index){
        field += " WHEN " + ele.id + " THEN " + "'" + ele.BitRate.replace(/\?\?/g, "±") + "'";
        where += ele.id + ","
    })
    field += " END ";
    where = where.substring(0, where.length-1) + ")";
    sql = sql + field + where;
    return sql;
}