/**
 * Run the this file.
 * To add login module test information to the login_test database table.
 * 把csv中的数据导入到用户表中
 * 
 * 运行方法：
 * 将方法1解除封印，并传入table_name
 */

var xlsx = require('node-xlsx');
let  fs = require('fs');
let  join = require('path').join;


// 1.批量导入数据
// let fileNames = findSync('./public/csv');
// // let table_name = 'Login_test';
// let table_name = 'Ipluggable_users';
// bulkOperation(fileNames);

// 2.清除Login_test中的数据 todos
// Login_test_Delete()

function Login_test_Delete(){
    return
}

/**
 * 查找当前文件夹下的所有文件
 * @param startPath  起始目录文件夹路径
 * @returns {Array}
 */
function findSync(startPath) {
    let result=[];
    function finder(path) {
        let files=fs.readdirSync(path);
        files.forEach((val,index) => {
            let fPath=join(path,val);
            let stats=fs.statSync(fPath);
            if(stats.isDirectory()) finder(fPath);
            if(stats.isFile()) result.push(fPath);
        });

    }
    finder(startPath);
    return result;
}
/**
 * 批量操作文件
 * @param {Array} fileNames 
 */
function bulkOperation(fileNames){
    var newFileNames = fileNames.map(function (item){
        return './public/csv/' + item.substring( item.lastIndexOf('\\')+1, item.length )
    })
    newFileNames.forEach(item=>{
        var sheets = xlsx.parse(item);//获取到所有sheets
        importCsv(sheets)

    })
}
/**
 * 将csv文件的内容导入到数据库
 * @param {Array} sheets 
 */
function importCsv(sheets) {
    var sheet1;
    var sheet2;

    sheets.forEach(sheet => {
        if (sheet.name == "Sheet1") {
            sheet1 = sheet;
        }
        if (sheet.name == "Sheet2") {
            sheet2 = sheet;
        }
    });

    if (sheet2) {
        var sql;
        var header = [];
        var values = [];
        var data = sheet2.data;
        for (var rowId in data) {
            if (rowId == "0"){
                header = data[rowId]
            }
            if (rowId != "0" && data[rowId].length != 0) {
                values.push(data[rowId]);
            }
        }
        // sql = "INSERT INTO url(`from`,`to`,`status`, `is_new`) VALUES ?";
        database({
            header: header,
            values: values,
            // table_name: 'Login_test'
            table_name: table_name
        })
    }
}

/**
 * 操作数据库
 * @param {Object} arg 
 */
function database (arg){
    var mysql = require('mysql');
    // 数据库信息
    var connection = mysql.createConnection({
        host: '135.252.218.128',
        user: 'webuser',
        password: 'web1830',
        database: 'VLMTest'
    });
    // var header = 'user_name,app_name,group,fullname';
    // var  addSql = 'INSERT INTO websites(Id,name,url,alexa,country) VALUES(0,?,?,?,?)';
    // var  addSqlParams = ['菜鸟工具', 'https://c.runoob.com','23453', 'CN'];
    // var header = arg.header;
    // var values = [
    //     ["index","www.alibaba.com",1,0],
    //     ["index1","www.google.com",1,0]
    // ];
    var values = arg.values;
    var table_name = arg.table_name;
    function FormatHeader(arr){
        // var arr = ["user_name", "app_name", "group"];
        var header = ''
        var left = '`'
        var right = '`'
        var comma = ','
        for (key in arr){
            
        header += left + arr[key] + right + comma

        }
        header = header.substring(0, header.length-1)
        return header
    }
    var header = FormatHeader( arg.header );
    var addSql = 'INSERT INTO ' + table_name + '(' + header + ') VALUES ?';
    // 操作数据库 方法 query
    connection.query(addSql, [values], function (err, result) {
        if(err){
            console.log('[INSERT ERROR] - ',err.message);
            return;
        }

        console.log('--------------------------INSERT----------------------------');
        //console.log('INSERT ID:',result.insertId);        
        console.log('INSERT ID:',result);        
        console.log('-----------------------------------------------------------------\n\n');  
    });
}
