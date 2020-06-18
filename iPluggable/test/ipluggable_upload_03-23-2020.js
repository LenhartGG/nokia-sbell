/**
 * Run the this file.  直接 F5运行即可
 * 把csv中的数据导入到用户表中
 * 
 * 运行方法：
 * 将方法1解除封印，并传入table_name
 * 
 * 将截图（./test/Capture_403_629/） 的地址（文件名） 保存到数据库（Ipluggable）表中
 */

var xlsx = require('node-xlsx');
let  fs = require('fs');
let  join = require('path').join;


// 1.批量导入数据
// let image_fileNames = findSync('./test/Capture_403_629/'); //在 ./test/Capture_403_629/ 文件夹下找文件
// let csv_fileName = "ipluggable_upload_20200320.csv";
// let table_name = 'Ipluggable';
// bulkOperation(csv_fileName);


// 解决温度异常 Temperature
// -0.470588235      -40/+85
// -0.071428571      -5/+70
// -0.066666667      -5/+75
// 前面是异常的值，后面是需要显示的值
// ##select id, Temperature from Ipluggable where Temperature='-0.470588235' or Temperature="-0.071428571" or Temperature="-0.066666667"
// ##update Ipluggable SET Temperature="-40/+85" where Temperature="-0.470588235" 
// ##update Ipluggable SET Temperature="-5/+70" where Temperature="-0.071428571"
// ##update Ipluggable SET Temperature="-5/+75" where Temperature="-0.066666667" 


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
            if(stats.isFile()) result.push(val);
        });

    }
    finder(startPath);
    return result;
}
/**
 * 批量操作文件
 * @param {Array} fileNames 
 */
function bulkOperation(fileName){
    var newFileName = './public/csv/' + fileName;

    var sheets = xlsx.parse(newFileName);//获取到所有sheets
    importCsv(sheets);
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
    if (sheet1){
        var sql;
        var header = [];
        var values = [];
        var data = sheet1.data;
        for (var rowId in data) {
            if (rowId == "0"){
                header = data[rowId]
            }
            // if(data[rowId][0] >= 403){
            if(data[rowId][0] >= 1){
                values.push(data[rowId]);
            }
        }
        
        /**
         * 补齐缺少link的values，因为csv源文件中缺少link字段
         * @param {*} values 
         */
        function addLinkstoValues(values){
            var newValues = values;
            newValues.forEach((record, record_index) => {
                    
                let record_id = record[0];
                // let record_apn = record[2];
                if(record_index >= 402){
                    image_fileNames.forEach(fileName => {
                        let file_id = fileName.split('_')[0];
                        // let file_apn = fileName.split('_')[1];
                        let file_number = fileName.split('_')[2][0];
                        // if(file_apn == record_apn){
                        if(file_id == record_id){
                            record[92+Number(file_number)] = fileName;
                        }
                    });
                }

                // 处理数据 解决Columns和Values的数量不匹配问题
                // [INSERT ERROR] -  ER_WRONG_VALUE_COUNT_ON_ROW: Column count doesn't match value count at row 2
                if(!record[93] || !record[94] || !record[95] || !record[96] || !record[97]){
                    record[97] = null;
                }

                // 处理csv中符号： ?? => ±
                record.forEach((element, ele_index) => {
                    if(typeof element == "string"){
                        if (element.includes("??")) {
                            record[ele_index] = element.replace(/\?\?/g, "±");
                        }
                        if (element.includes("\\N")) {
                            record[ele_index] = null;
                        }
                    }
                });
            });
            return newValues;
        }
        values = addLinkstoValues(values);
        
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
