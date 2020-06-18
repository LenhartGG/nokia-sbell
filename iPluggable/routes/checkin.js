var express = require("express");
var Pool = require("../database/pool");
var db = require("../test/mysql");
var router = express.Router();
var mysqlconfig = require('../test/mysql.config')
const TABLE_NAME = mysqlconfig.tablename;
var timeStamp;
var selectAPN;
var selectId;
var selectNumber;
var addNumber;
var selectArray = [];

/* GET resultSearch page. */
router.get("/", function(req, res, next) {
    try {
        res.render("checkin", { title: "iPluggable | Check in" });        
    } catch (error) {
        console.log(error);
    }
});
router.post("/checkInGroup", function(req, res, next) {
    var failure = { "status": 0, "message": "Failed to get data" ,"error":[]};
    var success = { "status": 1, "message": "Success" ,"value":{}};
    var data = req.body.srcData;
    timeStamp = req.body.timeStamp;
    selectNumber = +req.body.selectNumber*1;
    addNumber = req.body.selectNumber*1;
    selectArray = []; //每次进来之后初始化这个数组
    // console.log("-----------------------------------------------------------------------------------------")
    // console.log('/checkInGroup : '+JSON.stringify(data))
    // ["Application","APN","FiberConnectortype","Targetdistance","BitRate","Source_type","Wavelength","Txpower","ExtinctionRation","Sensitivity_BacktoBack","PathPenalty","Overload","AttenuationRange","Link","Link2"]
    var sqlSelect = "select id from "+TABLE_NAME+" where APN = '"+data.APN+"'";
    var sqlInsert = "insert into "+TABLE_NAME+" (";
    var sqlUpdate = "update "+TABLE_NAME+ " set "
    var keys = Object.keys(data);
    //sqlInsert,sqlUpdate
    keys.forEach(key => {
        if(keys.indexOf(key) != keys.length-1){
            sqlInsert = sqlInsert + key +','
        }else{
            sqlInsert = sqlInsert + key + ') value('
        }
    });
        keys.forEach(key => {
            var value = data[key];
            timeStamp = timeStamp;
            selectAPN = data.APN;
                if (keys.indexOf(key) != keys.length - 1) {
                    if (value.indexOf('\\') > 0) {
                        fileNumber = createNumber(key);
                        selectArray.push(fileNumber);
                        value = value.substring(value.lastIndexOf('\\') + 1);
                        value = escape(value)
                        value = createFileName(value, selectAPN, fileNumber )
                    }
                    sqlInsert = sqlInsert + "'" + value + "',";
                    if (value) {
                        sqlUpdate = sqlUpdate + key + " ='" + value + "',";
                    }
                } else {
                    // sql = sql +"'"+ data[key] + "');"            
                    if (value.indexOf('\\') > 0) {
                        fileNumber = createNumber(key);
                        selectArray.push(fileNumber);
                        value = value.substring(value.lastIndexOf('\\') + 1);
                        value = escape(value);
                        value = createFileName(value, selectAPN, fileNumber )
                    }
                    sqlInsert = sqlInsert + "'" + value + "');";
                    if (value) {
                        sqlUpdate = sqlUpdate + key + " ='" + value + "' where APN ='"+data.APN+"';";
                    }else{
                        sqlUpdate = sqlUpdate + " where APN ='"+data.APN+"';";
                    }
                }        
        });
        // console.log("-----------------------------------------------------------------------------------------")
        // console.log("/checkInGroup sqlSelect : "+sqlSelect);
        // console.log("-----------------------------------------------------------------------------------------")
        // console.log("/checkInGroup sqlInsert : "+sqlInsert);
        // console.log("-----------------------------------------------------------------------------------------")
        // console.log("/checkInGroup sqlUpdate : "+sqlUpdate);
        var promise;
        var selectPro = Pool.pool.excSingleSql(sqlSelect);
        selectPro.then(function(response, errorArr){
            if(errorArr){
                failure.error = errorArr;
                res.send(failure);
            }else{
                // console.log("response: " +  JSON.stringify(response));
                // 1.存在 response []
                if(response){
                    // 1.2 response 数组不为空，那就更新当前的数据
                    if (response.length) {
                        promise = Pool.pool.excSingleSql(sqlUpdate);
                    } 
                    // 1.1 response时空数组，即数据库查不到时就insert 
                    else {
                        promise = Pool.pool.excSingleSql(sqlInsert);
                    }
                    if(promise){
                        promise.then(function(resp, errArr){
                            if(!errArr && resp){
                                success.value = resp;
                                res.send(success);
                            }else{
                                failure.error = errorArr;
                                res.send(failure);
                            }
                        });
                    }
                } 
                // 2. response 为 undefined 时
                else{
                    res.send(failure);
                }
            }
        });
    
});

router.post("/selectAPN", function(req, res, next) {
    var failure = { "status": 0, "message": "Failed to get data" ,"error":[]};
    var success = { "status": 1, "message": "Success" ,"value":[]};
    var apn = req.body.APN;
    var sql = "select * from "+
        TABLE_NAME+" where APN = '"+apn+"';"
    var promise = Pool.pool.excSingleSql(sql);
    promise.then(function(response, errorArr){
        // console.log("response: " +  JSON.stringify(response));
        if(errorArr){
            failure.error = errorArr;
            res.send(failure);
        }else{
            if(response){
                success.value = response[0];
                res.send(success);
            } else {
                res.send(failure);
            }
            
        }
    });

});

/**
  * upload start
  */
var fs = require('fs');
var multer  = require('multer')
var createFolder = function(folder){
  try{
      fs.accessSync(folder); 
  }catch(e){
      fs.mkdirSync(folder);
  }  
};
var uploadFolder = './upload/';
createFolder(uploadFolder);
// 通过 filename 属性定制
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
  },
  filename: function (req, file, cb) {
    // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
    // cb(null, file.fieldname + '-' + Date.now()); 
    var fileName = file.originalname;
    
    fileNumber = selectArray[addNumber%selectNumber];
    var newName = createFileName(fileName, selectAPN, fileNumber )
    addNumber++;
    cb(null, newName);  
  }
});

function createFileName( fileName, selectAPN, fileNumber){
    var newName = '';
    if( fileName && selectAPN && fileNumber ){
        var str1 = fileName.substring(0, fileName.lastIndexOf('.'));
        var str2 = fileName.substring(fileName.lastIndexOf('.'));
        newName = selectAPN + '_' + fileNumber + str2;
        return newName;
    } else {
        return newName;
    }
}
/**
 * 创建文件名
 * @param {str} fileName 文件名
 * @param {str} timeStamp 时间戳
 */
function createFileName_old(fileName, timeStamp){
    var newName = '';
    if ( fileName && timeStamp ) {
        var str1 = fileName.substring(0, fileName.lastIndexOf('.'));
        var str2 = fileName.substring(fileName.lastIndexOf('.') + 1);
        newName = str1 + '-' + timeStamp  + "." + str2;
        return newName;
    } else {
        return newName;
    }
}

// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({ storage: storage })
router.post('/multi_merge', upload.any(), function(req, res, next){
//   var file = req.files;
//   var paths = {};
//   for (let i = 0; i < files.length; i++) {
//     var file = files[i];
//     if(file.fieldname == 'avatar3'){
//       paths.TestReport = file.path;
//       console.log("-----------------------------------------------------------------------------------------")
//       console.log('文件fieldName：%s', 'testReport');
//       console.log('文件类型：%s', file.mimetype);
//       console.log('原始文件名：%s', file.originalname);
//       console.log('文件大小：%s', file.size);
//       console.log('文件保存路径：%s', file.path);
//     }else if(file.fieldname == 'avatar4'){
//       paths.Certification = file.path;
//       console.log("-----------------------------------------------------------------------------------------")
//       console.log('文件fieldName：%s', 'certification');
//       console.log('文件类型：%s', file.mimetype);
//       console.log('原始文件名：%s', file.originalname);
//       console.log('文件大小：%s', file.size);
//       console.log('文件保存路径：%s', file.path);
//     }
//   }
    res.end()
});
/**
  * upload end
 */

 //download start
 router.get('/download', function(req, res, next){
  var failure = { 'status': 0, 'message': "Failed to get data" };
  var success = { 'rows': "",'total':"" };
   console.log("req.query : " +JSON.stringify(req.query));
   var path =req.query.path;
//    console.log("Download ------------ "+path);
  //  console.log("Download ------------ "+req.body.TestReport);
  res.download(path,path.split("\\")[1],function(err){
    if(err){
      console.log(JSON.stringify(err));
      res.send(failure);
    }else{
      console.log("OK");
    }
  });  
 });
 //download end

router.get("/fetchtype", function(req, res, next) {
    var failure = { "status": 0, "message": "Failed to get data" ,"error":[]};
    var success = { "status": 1, "message": "Success" ,"value":{}};
    var sqlArr = [];
    sqlArr.push("select distinct TYPE from "+TABLE_NAME);
    sqlArr.push("select distinct Application from "+TABLE_NAME);
    sqlArr.push("select distinct FiberConnectortype from "+TABLE_NAME);
    sqlArr.push("select distinct SubApp from "+TABLE_NAME);
    // sqlArr.push("select distinct APN from "+TABLE_NAME);
    // sqlArr.push("select distinct Temperature from "+TABLE_NAME);
    // sqlArr.push("select distinct Targetdistance from "+TABLE_NAME);
    // sqlArr.push("select distinct Wavelength from "+TABLE_NAME);

    var promise =  Pool.pool.excSqlArrAsync(sqlArr);
    promise.then(function(resArr,errorArr){
        if(errorArr){
            failure.error = errorArr;
            res.send(failure);
        }else{
            // success.value.APN = parseData4Select2('APN',resArr[0]);
            success.value.TYPE = parseData4Select2('TYPE',resArr[0]);
            success.value.Application = parseData4Select2('Application',resArr[1]);
            success.value.FiberConnectortype = parseData4Select2('FiberConnectortype',resArr[2]);
            success.value.SubApp = parseData4Select2('SubApp',resArr[3]);

            // console.log("-----------------------------------------------------------------------------------------")
            // console.log(success.value)
            res.send(success);
        }
    });
});
// parse data for select2 [{id:0,text:""},{id:1,text:""},...]
function parseData4Select2(key,dataArr){
	var resultArr = [];
    dataArr.forEach(element => {
        resultArr.push({
            id:dataArr.indexOf(element)+1,
            text:element[key]
        });
    });	
	return resultArr;
}

function createNumber(key){
    var number;
    if(key == 'Link3'){
        number = 1;
    }
    if(key == 'Link4'){
        number = 2;
    }
    if(key == 'Link5'){
        number = 3;
    }
    if(key == 'Link6'){
        number = 4;
    }
    if(key == 'Link7'){
        number = 5;
    }
    return number;
}

module.exports = router;