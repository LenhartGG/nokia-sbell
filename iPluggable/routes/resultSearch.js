var express = require("express");
var Pool = require("../database/pool");
var router = express.Router();
var mysqlconfig = require('../test/mysql.config')
const TABLE_NAME = mysqlconfig.tablename;

/* GET resultSearch page. */
router.get("/", function(req, res, next) {
    try {
        res.render("resultSearch", { title: "iPluggable | SearchResult" });        
    } catch (error) {
        console.log(error);
    }
});

router.post("/searchByAdvancedFilters", function(req, res, next) {
    var failure = { "status": 0, "message": "Failed to get data" ,"error":[]};
	var success = { "status": 1, "message": "Success" ,"value":{}};
    var filters = req.body;
    var tempArr = ['APN', 'Application','TYPE','SubApp','Temperature','Targetdistance','Wavelength','FiberConnectortype'];
    var keysArr = [];
    var sql = "select * from "+ TABLE_NAME + " where ";
    if (Object.keys(filters).length!=0){
        for (var key in filters) {
            if (tempArr.indexOf(key) >= 0) {
                keysArr.push(key);
            }
        }
        keysArr.forEach(key => {
            var arr = [];
            var valArr = filters[key];
            if(valArr instanceof Array){
                valArr.forEach(value => {
                    arr.push(key+" = '"+value+"'");            
                });
                arr.forEach(element => {
                   if(arr.indexOf(element) != arr.length-1){
                       sql = sql + element +" or "
                   } else {
                       sql = sql + element;
                   }
                });
                if(keysArr.indexOf(key) != keysArr.length-1){
                    sql = sql + " and ";
                }
            }        
        });    
    } else {
        sql = "select * from " + TABLE_NAME;
    }

    sql = sql + ' ORDER BY `id` ASC';
    // console.log("-----------------------------------------------------------------------------------------")
    // console.log("/searchByAdvancedFilters  sql : "+sql)
    var promise = Pool.pool.excSingleSql(sql);
    promise.then(function(response, errorArr){
        if(errorArr){
            failure.error = errorArr;
            res.send(failure);
        }else{
            if(response){
                success.value = response;
                res.send(success);
            } else{
                res.send(failure);
            }
        }
    });
});

router.get("/fetchInitialFilters", function(req, res, next) {
    var failure = { "status": 0, "message": "Failed to get data" ,"error":[]};
    var success = { "status": 1, "message": "Success" ,"value":{}};
    var sqlArr = [];
    sqlArr.push("select distinct APN from "+TABLE_NAME);
    sqlArr.push("select distinct TYPE from "+TABLE_NAME);
    sqlArr.push("select distinct Application from "+TABLE_NAME);
    sqlArr.push("select distinct SubApp from "+TABLE_NAME);
    sqlArr.push("select distinct Temperature from "+TABLE_NAME+" ORDER BY Temperature ASC");
    sqlArr.push("select distinct Targetdistance from "+TABLE_NAME+" ORDER BY Targetdistance ASC");
    sqlArr.push("select distinct Wavelength from "+TABLE_NAME+" ORDER BY Wavelength ASC");
    sqlArr.push("select distinct FiberConnectortype from "+TABLE_NAME);
    var promise =  Pool.pool.excSqlArrAsync(sqlArr);
    promise.then(function(resArr,errorArr){
        if(errorArr){
            failure.error = errorArr;
            res.send(failure);
        }else{
            if(resArr){
                success.value.APN = parseData4Select2('APN',resArr[0]);
                success.value.TYPE = parseData4Select2('TYPE',resArr[1]);
                success.value.Application = parseData4Select2('Application',resArr[2]);
                success.value.SubApp = parseData4Select2('SubApp',resArr[3]);
                success.value.Temperature = parseData4Select2('Temperature',resArr[4]);
                success.value.Targetdistance = parseData4Select2('Targetdistance',resArr[5]);
                success.value.Wavelength = parseData4Select2('Wavelength',resArr[6]);
                success.value.FiberConnectortype = parseData4Select2('FiberConnectortype',resArr[7]);
                // console.log(success.value)
                res.send(success);
            }else{
                res.send(failure);
            }
        }
    });
});
router.get("/fetchInitialFilters", function(req, res, next) {
    var failure = { "status": 0, "message": "Failed to get data" ,"error":[]};
    var success = { "status": 1, "message": "Success" ,"value":{}};
    var sqlArr = [];
    sqlArr.push("select distinct APN from "+TABLE_NAME);
    sqlArr.push("select distinct TYPE from "+TABLE_NAME);
    sqlArr.push("select distinct Application from "+TABLE_NAME);
    sqlArr.push("select distinct SubApp from "+TABLE_NAME);
    sqlArr.push("select distinct Temperature from "+TABLE_NAME+" ORDER BY Temperature ASC");
    sqlArr.push("select distinct Targetdistance from "+TABLE_NAME+" ORDER BY Targetdistance ASC");
    sqlArr.push("select distinct Wavelength from "+TABLE_NAME+" ORDER BY Wavelength ASC");
    sqlArr.push("select distinct FiberConnectortype from "+TABLE_NAME);
    var promise =  Pool.pool.excSqlArrAsync(sqlArr);
    promise.then(function(resArr,errorArr){
        if(errorArr){
            failure.error = errorArr;
            res.send(failure);
        }else{
            if(resArr){
                success.value.APN = parseData4Select2('APN',resArr[0]);
                success.value.TYPE = parseData4Select2('TYPE',resArr[1]);
                success.value.Application = parseData4Select2('Application',resArr[2]);
                success.value.SubApp = parseData4Select2('SubApp',resArr[3]);
                success.value.Temperature = parseData4Select2('Temperature',resArr[4]);
                success.value.Targetdistance = parseData4Select2('Targetdistance',resArr[5]);
                success.value.Wavelength = parseData4Select2('Wavelength',resArr[6]);
                success.value.FiberConnectortype = parseData4Select2('FiberConnectortype',resArr[7]);
                // console.log(success.value)
                res.send(success);
            } else {
                res.send(failure);
            }
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
module.exports = router;