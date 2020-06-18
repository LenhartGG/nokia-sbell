var express = require("express");
var Pool = require("../database/pool");
var router = express.Router();
var mysqlconfig = require('../test/mysql.config')
const TABLE_NAME = mysqlconfig.tablename;

// fetchAllResult
// fetchResult4FuzzyQuery

/* GET home page. */
router.get("/", function(req, res, next) {
	var apn = req.query.apn;
	console.log("index /apn="+apn);
	if(!apn){
		apn="";
	}
	res.render("index", { title: "Home",'apn':apn });
});
router.post("/index/fetchAllResult", function(req, res, next) {
	var failure = { "status": 0, "message": "Failed to get data" ,"error":[]};
	var success = { "status": 1, "message": "Success" ,"value":null};
	var fromID = 0;
	if(req.body.limit){
		limitCount = req.body.limit;
	}
	if(req.body.from){
		fromID = req.body.from;
	}

	// var sql = "select id,TYPE,APN,Application,SubApp,Temperature,Targetdistance,Wavelength,FiberConnectortype,PowerConsumption,PhysicalDimension,Acronym,CLEICode,Specification,1ABinBOM,RelatedAPN from "+
	// TABLE_NAME + " where id >= "+fromID+" limit "+limitCount;
	
	var sql = "select * from " +
	TABLE_NAME + " where id >= "+fromID;

	var promise = Pool.pool.excSingleSql(sql);
	promise.then(function (response, err) {
		// console.log("-----------------------------------------------------------------------------------------")
		// console.log("/index/fetchAllResult sql : "+sql);
		if(err){
			failure.error = err;
			res.send(failure);
		}else{
			if(response){
				success.value = response;
				res.send(success);
			} else {
				res.send(failure);
			}
		}
	})
});

// search 查询
router.post("/index/fetchResult4FuzzyQuery", function(req, res, next) {
	var failure = { "status": 0, "message": "Failed to get data" };
	var success = { "status": 1, "message": "Success" ,"value":null};
	var sql = createSql({
		search: req.body.search,
		limitCount: req.body.limitCount,
	})
	function createSql(arg){
		// var sql = "select id,TYPE,APN,Application,SubApp,Temperature,Targetdistance,Wavelength,FiberConnectortype,PowerConsumption,PhysicalDimension,Acronym,CLEICode,Specification,1ABinBOM,RelatedAPN from "+TABLE_NAME+" where " + 
		// "concat(TYPE,APN,Application,SubApp,Temperature,Targetdistance,Wavelength,FiberConnectortype,PowerConsumption,PhysicalDimension,Acronym,CLEICode,Specification,1ABinBOM,RelatedAPN,Vendor1,Vendor1PN,Vendor2,Vendor2PN,Vendor3,Vendor3PN,Vendor4,Vendor4PN,Vendor5,Vendor5PN) like " + 
		// 	"'%"+req.body.search+"%'";
		var limitCount = arg.limitCount || 100;
		var concat = "";
		var subconcat = "concat(`TYPE`,`APN`,`Application`,`SubApp`,`Temperature`,`Targetdistance`,`Wavelength`,`FiberConnectortype`) like ";
		var search = arg.search;
		search.forEach(item => {
			concat += subconcat + "'%"+item+"%'" +  " or ";
		});
		concat = concat.substring(0, concat.lastIndexOf('or'));
		var sql =  "select * " +
			"from " + TABLE_NAME+" where " + concat + " ORDER BY `id` ASC";
		return sql;
	}
	var promise = Pool.pool.excSingleSql(sql);
	promise.then(function (response, err) {
		// console.log("-----------------------------------------------------------------------------------------")
		// console.log("/index/fetchResult4FuzzyQuery sql : "+sql);
		if(err){
			failure.error = err;
			// res.status(500).send({ error: "Something blew up!"+err });
			res.send(failure);
		}else{
			if(response){
				success.value = response;
				res.send(success);
			} else {
				res.send(failure);
			}
		}
	});
});

module.exports = router;