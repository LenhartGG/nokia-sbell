var db = require("./mysql");


// transferUser_name()
function transferUser_name() {

    var sql = 'SELECT DISTINCT `user_name` from `Login_test`';

    db.query(sql, [], function (result, fields) {
        // values 
        // var values = [
        //     ["index","www.alibaba.com",1,0],
        //     ["index1","www.google.com",1,0]
        // ];

        var values = [];
        for (var item in result) {
            values[Number(item)] = new Array();
            values[Number(item)][0] = result[item].user_name;
        }
        console.log(JSON.stringify(values))

        db.query('INSERT INTO `Login_user` (`user_name`) VALUES ?', [values], function (result, fields) {
            console.log('插入结果：');
            console.log(result);
        })
    });
}
// transferApp_name()
function transferApp_name() {
    var sql = 'SELECT DISTINCT `app_name` from `Login_test`';

    db.query(sql, [], function (result, fields) {
        // values 
        // var values = [
        //     ["index","www.alibaba.com",1,0],
        //     ["index1","www.google.com",1,0]
        // ];

        var values = [];
        for (var item in result) {
            values[Number(item)] = new Array();
            values[Number(item)][0] = result[item].app_name;
        }
        console.log(JSON.stringify(values))

        db.query('INSERT INTO `Login_app_name` (`app_name`) VALUES ?', [values], function (result, fields) {
            console.log('插入结果：');
            console.log(result);
        })
    });
}

// transferGroup()
function transferGroup() {
    var sql = 'SELECT DISTINCT `group` from `Login_test`';

    db.query(sql, [], function (result, fields) {
        // values 
        // var values = [
        //     ["index","www.alibaba.com",1,0],
        //     ["index1","www.google.com",1,0]
        // ];

        var values = [];
        for (var item in result) {
            values[Number(item)] = new Array();
            values[Number(item)][0] = result[item].group;
        }
        console.log(JSON.stringify(values))

        db.query('INSERT INTO Login_group (`group`) VALUES ?', [values], function (result, fields) {
            console.log('插入结果：');
            console.log(result);
        })
    });
}

// transferFullname()
function transferFullname() {

    var sql = 'SELECT DISTINCT `fullname` from `Login_test`';

    db.query(sql, [], function (result, fields) {
        // values 
        // var values = [
        //     ["index","www.alibaba.com",1,0],
        //     ["index1","www.google.com",1,0]
        // ];

        var values = [];
        for (var item in result) {
            values[Number(item)] = new Array();
            values[Number(item)][0] = result[item].fullname;
        }
        console.log(JSON.stringify(values))

        db.query('INSERT INTO `Login_fullname` (`fullname`) VALUES ?', [values], function (result, fields) {
            console.log('插入结果：');
            console.log(result);
        })
    });
}

/**
 * 向关系表 user_group_table 插入数据
 */
// transferUser_group()
function transferUser_group() {
    var result1 = [];   //Login_test
    var result2 = [];   //Login_user
    var result3 = [];   //Login_app_name
    var result4 = [];   //Login_group
    var result5 = [];   //Login_fullname

    var sql1 = 'SELECT * FROM `Login_test` ';
    var sql2 = 'SELECT * FROM `Login_user` ';
    var sql3 = 'SELECT * FROM `Login_app_name` ';
    var sql4 = 'SELECT * FROM `Login_group` ';
    var sql5 = 'SELECT * FROM `Login_fullname` ';
    var sql6 = "INSERT INTO `Login_user_group_table` (`user_id`, `app_id`, `group_id`, `fullname_id`) values ?"
    // sql1
    db.query(sql1, [], function (result, fields) {
        result1 = result;
        // sql2
        db.query(sql2, [], function (result, fields) {
            result2 = result;
            // sql3
            db.query(sql3, [], function (result, fields) {
                result3 = result;
                // sql4
                db.query(sql4, [], function (result, fields) {
                    result4 = result;
                    // sql5
                    db.query(sql5, [], function (result, fields) {
                        result5 = result;
                        // 向关系表中插入数据
                        var values = createValues({
                            result1: result1,
                            result2: result2,
                            result3: result3,
                            result4: result4,
                            result5: result5
                        });
                        console.log(values)
                        db.query(sql6, [values], function (result, fields) {
                            console.log(result, fields);
                        });

                    });
                });
            });
        });
    });
}

// createValues
function createValues(arg){
    // var values = [
    //     ["user_id","app_id","group_id","fullname_id"],
    //     ["user_id","app_id","group_id","fullname_id"],
    // ];
    var values = [];
    var result1 = arg.result1;
    var result2 = arg.result2;
    var result3 = arg.result3;
    var result4 = arg.result4;
    var result5 = arg.result5;

    for(var item1 of result1){
        var value = [];
        // user_id
        for( var item2 of result2){
            if(item1.user_name == item2.user_name){
                value[0] = item2.Id.toString();
                break;
            }
        }
        // app_id
        for( var item3 of result3){
            if(item1.app_name == item3.app_name){
                value[1] = item3.Id.toString();
                break;
            }
        }
        // group_id
        for( var item4 of result4){
            if(item1.group == item4.group){
                value[2] = item4.Id.toString();
                break;
            }
        }
        // fullname_id
        for( var item5 of result5){
            if(item1.fullname == item5.fullname){
                value[3] = item5.Id.toString();
                break;
            }
        }
        values.push(value)
    }
    return values;
}

// immediate excute

// transferUser_name();
// transferApp_name();
// transferGroup();
// transferFullname();
// transferUser_group();

exports.transferData = {
    user_name: transferUser_name,
    group: transferGroup,
    app_name: transferApp_name,
    fullname: transferFullname,
    user_group: transferUser_group
};