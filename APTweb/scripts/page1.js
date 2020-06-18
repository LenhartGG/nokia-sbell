var httpcontent = "./"; //vscode
// var httpcontent = "http://10.243.28.45:9991/";  //nginx
var HOST_RESTFUL="http://10.243.2.207:5000"; //track host
//获取原网页log汇总链接 参数：原网页html名称 例如，test_case_results.html。 请重命名。
var GlobalLogUrl = getGlobalLogUrl();

var outDoc = null;
var newData = [];
var globalColumns = [];
var categoryData = null;
var colorList = {
    apt_issue: '#3E5ABC',
    traffic_verify_issue: '#F75000',
    case_cfg_env: '#FF8040',
    ne_issue: '#FF5151',
    ne_connection: '#3E5ABC',
    instrument: '#3E5ABC'
};
var optionList = {
    default: "---NULL---",
    ne_issue: "Production Issue",
    traffic_verify_issue: "Traffic Issue",
    case_cfg_env: "Configuration Issue",
    apt_issue: "Platform Issue",
    ne_connection: "Connection Issue",
    instrument: "Instrument Issue",
    others: "Others",
};

$(function(){
    getPage1Html();
    LoginFunction();
})

/**
 * 获取备份网页链接 test_case_results_bak.html
 */
function getGlobalLogUrl(){
    var httphref = document.location.href;
    if(httphref.includes('127.0.0.1') || httphref.includes('10.243.28.45')){
        return "http://135.252.217.201/~SHShelfTest02/QFA/SH_TARG_SVT_PTP/SH_DPEL2_PTP/191213030841/logs/" + "test_case_results.html";
    }
    if(!httphref.includes('/logs/')){
        return httphref;
    }
    httphref = httphref.substring(0, httphref.indexOf('/logs/')+6) + "test_case_results_bak.html";
    return httphref;
}

/**
 * 当前网页的链接 test_case_results.html
 */
function getLocationHref(){
    var httphref = document.location.href;
    if(httphref.includes('127.0.0.1') || httphref.includes('10.243.28.45')){
        return "http://135.252.217.201/~SHShelfTest02/QFA/SH_TARG_SVT_PTP/SH_DPEL2_PTP/191213030841/logs/" + "test_case_results.html";
    }
    return httphref;
}

// 获取page1页面
function getPage1Html(){
    // 此处需要切换
    var page1url = '';
    var httphref = location.href;
    if(httphref.includes('127.0.0.1')||httphref.includes('10.243.28.45')){
        // var page1url = httpcontent+"-%20Testcase%20Results.html";
        page1url = httpcontent+"Test Results.html";
    }
    else {
        page1url = httpcontent+"test_case_results.html";
    }
    
    var request = $.ajax({
        url: page1url,
        method: "GET",
    });
    request.done(function( data ) {
        // console.log(data);
        var iframe = data;
        // 获取Status table的数据
        getStatustableData(iframe);
        // var $body = $('.body p');
        // $body.html($table);
        
    });
    request.fail(function ( jqXHR, textStatus ) {
        console.log( "Request failed: " + textStatus );
    })
}

function getStatustableData(html){
    outDoc = new DOMParser().parseFromString(html, 'text/html');
    // console.log(outDoc);
    
    // console.log($table);
    // console.log($table.prevObject);
    
    // 设置header和footer
    seHeaderAndFooter( $(outDoc) );

    // 获取分类数据
    getCategory(outDoc);
    
}

function getTableRowsLength(tag){
    var mytable = tag;
    return mytable.rows.length;
}

function seHeaderAndFooter($html){
    var $body = $html.find('body').children();
    // console.log($body);
    $header = $body.slice(0, 2);
    $footer = $body.slice(3, $body.length-2);
    $('.header .description').html($header);
    
    $('.footer').html($footer);
}




/**
 * 获取分类数据 
 * 分类数据负责为 分类table 和 汇总table 提供数据
 * @param {*} outDoc 
 */
function getCategory(outDoc){
    
    // var url = './aptData.json';
    // var method = 'GET';
    var url = 'http://135.252.218.106:18081/api/web/airesult';
    var method = 'POST';
    var ContentType = "application/json";
    var param = {
        url: GlobalLogUrl
    }
    
    var request = $.ajax({
        url: url,
        method: method,
        contentType: "application/json",
        crossDomain:true,
        data: JSON.stringify(param)
    });
    request.done(function( category ) {
        categoryData = category;

        // 初始化汇总table
        initSummaryTable(outDoc, categoryData);

    });
    request.fail(function ( jqXHR, textStatus ) {
        console.log( "Request failed: " + textStatus );
    })
}

/**
 * 创建 summary table
 * @param {object} outDoc 
 */
function initSummaryTable(outDoc, categoryData){
    var id = 1;
    var oldColumns = [];
    var newColumnsArr = ['profile', 'number', 'test', 'config', 'options', 'starttime', 'elapsed', 'ConfirmedMRs', 'status', 'results', 'runDetails']
    var newColumns = [];
    // var newData = [];
    var  $table = $(outDoc).find('table');
    
    var  $tabletr = $(outDoc).find('table tbody  tr');
    var $tableth = $(outDoc).find('table tbody  th');
    $tableth.each(function(thIndex, thItem){
        var text = $(thItem).html();
        oldColumns.push(text);
    })
    console.log(oldColumns);
    globalColumns = oldColumns;
    
    $tabletr.each(function(trIndex, trItem){
        if (trIndex > 1) {
            var newtr = {};
            var that = $(this);
            // newColumns.forEach(function(item, index) {
            //     // console.log('----------');
                
                that.find('td').each(function(tdIndex, tdItem){
                    // console.log(tdIndex);
                    // console.log(id);
                    // console.log(tdItem);
                    // console.log($(this).html());
                    // var field = $(this).html();
                    // newColumns.push({
                    //     field: field,
                    //     title: field,
                    // });
                    // console.log(item.field);
                    // newtr.id = id;
                    
                    // newtr[newColumnsArr[tdIndex]] = $(tdItem).html();
                    newtr[oldColumns[tdIndex]] = $(tdItem).html().trim();
                    
                })
            // });
            id++;
            // console.log(newtr);
            
            newData.push(newtr);
            return;
        }

        // console.log(trItem);
        // console.log($(this));
    });

    // 改写超链接 href
    overwriteHyperLink(newData, categoryData);
    // console.log(categoryData);
    // console.log(newData);
    // debugger;
    // 添加 AI Classification 的
    var summarytableData = newData;
    addAIClassification(summarytableData, categoryData);
    var thList = '';
    thList = createThList();
    


    var tableSummaryHtml = [
        '<table ' ,
            'id="tableSummary" ',
            'class="table table-sm table-bordered"> ',
            '<thead> ',
                '<tr> ',
                    thList,
                    // <th data-field="profile" data-width="175" data-align="left">Profile</th>
                    // <th data-field="number"  data-width="23" data-align="center">#</th>
                    // <th data-field="test"  data-width="290" data-align="left">Test</th>
                    // <th data-field="config" data-width="290" data-align="left">Config</th>
                    // <th data-field="options" data-width="196" data-align="left">Options</th>
                    // <th data-field="starttime" data-width="100" data-align="left">StartTime - new</th>
                    // <th data-width="65" data-field="elapsed">Elapsed</th>
                    // <th data-width="110" data-field="ConfirmedMRs">Confirmed MRs</th>
                    // <th 
                    //     data-width="70" 
                    //     data-field="status"
                    //     data-formatter="statusFormatter"
                    //     data-events="operateEvents">
                    //     Status
                    // </th>
                    // <th data-width="178" data-field="results">Results(Pass/Fail/Skip)</th>
                    // <th data-width="90" data-field="runDetails">Run Details</th>
                    // <th 
                    //     data-field="prediction" 
                    //     class="prediction"
                    //     data-width="120"
                    //     data-cell-style="cellStyle"
                    //     data-align="center" 
                    //     data-formatter="aiClassificationFormatter">
                    //     AI Classification
                    // </th>
                    // <th 
                    //     data-field="labeling" 
                    //     data-width="120"
                    //     data-cell-style="cellStyle"
                    //     data-align="center" 
                    //     data-formatter="labelingFormatter" 
                    //     data-events="operateEvents">
                    //     user Proposed Case
                    // </th>
                '</tr> ',
            '</thead> ',
        '</table>',
    ].join('');
    $('.tableSummaryBox').append(tableSummaryHtml);
    
    // init table
    var classes = 'table-sm table-bordered';
    $('#tableSummary').bootstrapTable({
        classes: classes,
        // columns: newColumns,
        data: newData
    });
    
    //用户行为记录跟踪
    fetchWholeBatch();
}


function createThList(hasCheckbox){
    var thList = '';
    var flag = hasCheckbox || false; //true or false
    var optionObj = {
        "Profile": {
        //    width: "175", 
           align: "left"
        },
        "#": {
        //    width: "23", 
           align: "center"
        },
        "Test": {
        //    width: "290", 
           align: "left"
        },
        "Config": {
        //    width: "290", 
           align: "left"
        },
        "Trace": {
        //    width: "290", 
           align: "center"
        },
        "Cardtype": {
        //    width: "290", 
           align: "center"
        },
        "Netype": {
        //    width: "290", 
           align: "center"
        },
        "Options": {
        //    width: "190", 
           align: "left"
        },
        "StartTime - new": {
        //    width: "100", 
           align: "left"
        },
        "Elapsed": {
        //    width: "65", 
           align: "center"
        },
        "Confirmed MRs": {
        //    width: "110", 
           align: "center"
        },
        "Status": {
           width: "70", align: "center", "data-formatter": 'data-formatter="statusFormatter"', "data-events": 'data-events="operateEvents"'
        },
        "Pass/Fail/Skip": {
           align: "center",
        },
        "AI Classification": {
            width: "120", align: "center", "data-formatter": 'data-formatter="aiClassificationFormatter"', "data-events": 'data-events="operateEvents"'
        },
        "user Proposed Case": {
            width: "120", align: "center", "data-formatter": 'data-formatter="labelingFormatter"', "data-events": 'data-events="operateEvents"'
        }
    }


    globalColumns.forEach(function(columns, index) {
        var width = '';
        var align = 'left';
        var formatter = '';
        var events = '';
        if(optionObj[columns]) {
            width = optionObj[columns].width;
            align = optionObj[columns].align;
            formatter = optionObj[columns].formatter;
            events = optionObj[columns].events;
        }
        
        thList += '<th data-field="'+columns+'" data-width="'+width+'"  data-align="'+align+'"  '+ formatter + events+'>'+columns+'</th>';
        
    });
    thList+=[
            '<th ',
            'class="prediction"',
            'data-width="120"',
            'data-cell-style="cellStyle"',
            'data-field="prediction" ',
            'data-align="center" ',
            'data-formatter="aiClassificationFormatter">',
            'AI Classification',
        '</th>',
        '<th ',
            'data-cell-style="cellStyle"',
            'data-width="120"',
            'data-field="labeling" ',
            'data-align="center" ',
            'data-formatter="labelingFormatter" ',
            'data-events="operateEvents">',
            'user Proposed Case',
        '</th>',
    ].join('');
    
    if (flag){ //添加checkbox
        thList  +=  '<th data-checkbox="'+flag+'"></th>';
        
        // thList  +=  '<th data-checkbox="'+flag+'"></th>'+
        // '<th '+
        //     'data-formatter="confirmFormatter" '+
        //     'data-events="operateEvents">'+
        //     'Is AI correct'+
        // '</th>';
    }

    return thList;
}

/**
 * 添加column
 * @param {*} newColumns 
 */
//暂时不执行
function addColumn(newColumns){
    // console.log(newColumns);
    newColumns.push({
        field: 'labeling',
        title: 'labeling',
    });
}

/**
 * 改写超链接 a.href
 * @param {*} newData 
 */
function overwriteHyperLink(newData, categoryData){
    
    //...这段代码用于给 href 添加 prediction 字段
    var originLink = location.href.substring(0, location.href.indexOf("/logs/") + 6);

    for (var outkey in categoryData) {
        if (categoryData.hasOwnProperty(outkey) && outkey!='issueSum' && outkey!='classes' && outkey!='isConfirm') {
            var subArray = categoryData[outkey];
            for (var subkey in subArray) {
                if (subArray.hasOwnProperty(subkey)) {
                    var subItem = subArray[subkey];
                    newData.forEach(function (record) {
                        var status = record["Status"];
                        var oldhref = '';
                        if( status.includes('FAIL') ) {
                            // console.log(status);
                            oldhref = status.split('"')[1];
                            oldhref = linkFormatter(oldhref);
                            if(subItem.caseUrl.endWith(oldhref+'/')){
                            // if(oldhref+'/'==subItem.caseUrl){
                                var href = "./page2.html?prediction="+ outkey + "&href=" + subItem.caseUrl + "&originLink=" + subItem.caseUrl;
                                record["Status"] = '<a href="'+href+'" target="_blank"><font color="red">FAIL</font></a>';
                            }

                        }
                        if( status.includes('BLOCKED') ) {
                            // console.log(status);
                            oldhref = status.split('"')[1];
                            oldhref = linkFormatter(oldhref);
                            if(subItem.caseUrl.endWith(oldhref+'/')){
                            // if(oldhref+'/'==subItem.caseUrl){
                                var href = "./page2.html?prediction="+ outkey + "&href=" + subItem.caseUrl + "&originLink=" + subItem.caseUrl;
                                record["Status"] = '<a href="'+href+'" target="_blank"><font color="block">BLOCKED</font></a>';
                            }

                        }
                    });
                }
            }
            
        }
    }
}

function linkFormatter(oldhref){
    var httphref = oldhref;
    if(oldhref.includes('./')){
        httphref = oldhref.substring(oldhref.lastIndexOf("./")+1, oldhref.length);

        return httphref;
    }
    return oldhref;
}

function addAIClassification(newData, categoryData){
    // console.log(categoryData);
    var summarytableData = newData;
        
    // 创建分类数量统计图
    createStatisticChart(categoryData);
    // console.log(categoryData);
    console.log("summarytableData:", summarytableData);
    // 创建 全部Correct 的提交表单
    createSubmitConfirm(categoryData.isConfirm);
    // 创建分类html结构及分类table 
    createCategoryTable(categoryData, summarytableData);
}

/**
 * 创建 全部Correct 的提交表单
 */
function createSubmitConfirm(isConfirm){
    var ConfirmAll = [
        '<div class="form-check"  style="font-size: 18px; margin:60px 0px 10px 0px;" >',
        '    <input class="form-check-input" type="checkbox" value="" id="confirmAll" style="margin-top: 0px; height: 20px; width: 18px; cursor: pointer;" > ',
        '    <label class="form-check-label" for="defaultCheck1" style="cursor: default;">',
        '        Confirm that all cases are checked.',
        '    </label>',
        '</div>',
        '<button id="submitConfirm" class="btn btn-primary" type="submit">Confirm</button>',
    ].join("");

    $('.header .description').append(ConfirmAll);

    // 初始化 Confirm all
    var confirmAll = $("#confirmAll");
    confirmAll.attr("checked", "checked");
    if(isConfirm){

        confirmAll.attr("checked", "checked");
    } else {
        
        confirmAll.removeAttr('checked');
    }
}

function aiClassificationFormatter(value, row, index){
    
    var colorList = {
        "Platform Issue": '#3E5ABC',
        "Traffic Issue": '#F75000',
        "Configuration Issue": '#FF8040',
        "Production Issue": '#FF5151',
        "Connection Issue": '#3E5ABC',
        "Instrument Issue": '#3E5ABC'
    };
    var html = '';
    if(row["Status"].includes("FAIL") || row["Status"].includes("BLOCKED")){
        // console.log(value);
        html =  '<div style="font-size: 16px; color:#fff; "><span class="badge" style="background-color: '+colorList[value]+';">'+value+'</span></div>';
        return html;
    }
    return html;
    
}


/**
 * labelingFormatter
 * refer to  Column Events of BT
 * @param {*} value 
 * @param {*} row 
 * @param {*} index 
 */
function labelingFormatter(value, row, index){
    
    
    var html = '';
    if(row["Status"].includes("FAIL") || row["Status"].includes("BLOCKED")){
        if(!value){
            value = '';
        }
        // console.log(value);
        // console.log(row);

        function createSelectOptions(){
            // var myOptions = '<option value="---NULL---">---NULL---</option>';
            var myOptions = '';
            if (!value) {
                for (var key in optionList) {
                    if (optionList.hasOwnProperty(key)) {
                        var element = optionList[key];
                        var selected = "";
                        if (row.checkClass == key || row.userComment) {
                            selected = "selected";
                        }
                        myOptions += '<option '+selected+' value="'+key+'">'+element+'</option>';
                    }
                }
            }
            if (value) {
                for (var key in optionList) {
                    if (optionList.hasOwnProperty(key)) {
                        var element = optionList[key];
                        var selected = "";
                        if(value == key || row.userComment){
                            selected = "selected";
                        }
                        myOptions += '<option '+selected+' value="'+key+'">'+element+'</option>';
                    }
                }
            }

            // var options =   '<option selected="false" value="---NULL---">---NULL---</option>'+
            //                 '<option selected="true" value="APT Issue">APT Issue</option>'+
            //                 '<option value="Config Issue">Config Issue</option>'+
            //                 '<option value="Instrument Issue">Instrument Issue</option>'+
            //                 '<option value="Ne Issue">Ne Issue</option>'+
            //                 '<option value="Traffic Issue">Traffic Issue</option>'+
            //                 '<option value="Connection">Connection</option>'+
            //                 '<option value="Others">Others</option>';
            return myOptions;
        }

        var options = createSelectOptions();
        var showComments = 'none';
        if(row.userComment){
            showComments = 'block';
        } else{
            showComments = 'none';
            row.userComment = '';
        }
        html = [
            '<div class="form-group" style="width: 120px">',
                '<select id="inputState"',
                    'class="form-control form-control-sm">',
                    options ,
                '</select>',
            '</div>',
            '<textarea style="display:'+showComments+'" class="textarea" name="" id="" cols="30" rows="10" >'+row.userComment+'</textarea>',
            '<div class="submit-box clearfix" style="display:'+showComments+'" >',
                '<button type="submit">submit</button>',
            '</div>',
        ].join('');
        
        return html;
    }

    return html;
}

function confirmFormatter(value, row, index) {
    // console.log(row);
    // console.log(row.isConfirm);
    
    var checked = '';
    if(row.isConfirm){
        checked = "checked";
    }
    // if(value){
    //     checked = value;
    // }
    
    var html =  '<input class="form-check-input" type="checkbox" '+
                    'style="position: initial; " '+
                    checked + '>';
    return html;
}

/**
 * refer to  Column Events of BT
 */
var operateEvents = {
    'change select': function (e, value, row, index) {
            // console.log(e);
            console.log(e.target.value);
            // console.log(value);
            console.log(row);
            // console.log(index);
            // console.log(row["Status"]);
            if(e.target.value.toLowerCase() == 'default'){
                // return;
            }
            
            var tableEle = e.target.parentElement.parentElement.parentElement.parentElement.parentElement;
            var $table = $(tableEle);
            // console.log(tableEle);

            // alert("caseUrl: "+ GlobalLogUrl + "\n\nrow: "+ JSON.stringify(row) + "\n\n value: "+ JSON.stringify(value));

            // trigglerConfirm(row.prediction);
            // sendDataToTrack();

            function trigglerConfirm(prediction){
                console.log(e.currentTarget.parentElement.parentElement.nextElementSibling.nextElementSibling.children[0]);
                var checkbox = e.currentTarget.parentElement.parentElement.nextElementSibling.nextElementSibling.children[0];
                var isCorrect = false;
                for(var i=0; i<optionList.length; i++){
                    var option = optionList[i];
                    if(prediction != null || prediction != option){
                        isCorrect = true;
                    }
                }
                checkbox.checked = isCorrect;
                
                sendConfirm(row.caseUrl, isCorrect);
            }
            

            /**
             * 发送当前行数据到后台
             */
            function sendDataToTrack(){    
                var url = '';
                var method = 'POST';
                var param = {
                    caseUrl: GlobalLogUrl,
                    row: row,
                    value: value
                }
                
                var request = $.ajax({
                    url: url,
                    method: method,
                    contentType: "application/json",
                    // crossDomain:true,
                    data: JSON.stringify(param)
                });
                request.done(function( res ) {
                    console.log(res);
                });
            }

            var selVal = "";
            var comments = "";
            // console.log("newData:", newData);
            
            // console.log("categoryData:", categoryData);

            //1.有多选
            if (row["14"]||row["13"]) {
                
                if(e.target.value.toLowerCase() == 'others'){ 
                    //1.选择Other
                    e.target.parentNode.nextElementSibling.style.display = 'block'
                    e.target.parentNode.nextElementSibling.nextElementSibling.style.display = 'block'
                    e.target.parentNode.nextElementSibling.focus();
                    comments = e.target.parentNode.nextElementSibling.value||"";
                    console.log(comments);
                    
                } else {
                    //2.不选择Other
                    console.log($table.bootstrapTable('getSelections'));
                    var Selections = $table.bootstrapTable('getSelections');
                    // alert("getSelections:"+JSON.stringify($table.bootstrapTable('getSelections')));

                    var casesData = [];
                    Selections.forEach(function (item) {
                        var newRow = item; newRow.checkClass = e.target.value;
                        $table.bootstrapTable('updateRow', {
                            "#": newRow["#"],
                            row: newRow
                        });
                        selVal = e.target.value;
                        casesData.push({
                            caseUrl: getResultCaseUrl(newRow),
                            checkClass: selVal
                        });
                        return;
                        sendUserCaseRequest({
                            caseUrl: getResultCaseUrl(newRow),
                            checkClass: selVal,
                        });
                        // selectWithoutComments(e, $table, row, newRow);
                    });

                    sendCasesCheckReq({
                        cases: casesData
                    });

                }
                
            } 
            // 2.无多选
            else {

                if(e.target.value.toLowerCase() == 'others'){ 
                    //1.选择Other
                    e.target.parentNode.nextElementSibling.style.display = 'block'
                    e.target.parentNode.nextElementSibling.nextElementSibling.style.display = 'block'
                    e.target.parentNode.nextElementSibling.focus();
                    comments = e.target.parentNode.nextElementSibling.value||"";
                    console.log(comments);
                    
                } else {
                    //2.不选Other
                    row.userComment = null; //清空输入的comments
                    e.target.parentNode.nextElementSibling.style.display = '';
                    e.target.parentNode.nextElementSibling.nextElementSibling.style.display = '';
                    selVal = e.target.value;
                    sendUserCaseRequest({
                        caseUrl: getResultCaseUrl(row),
                        checkClass: selVal,
                    });
                    // selectWithoutComments(e, $table, row, row);
                }

            }

    },
    'click button': function (e, value, row, index) {
        // console.log(e.currentTarget.parentNode.previousElementSibling.value);
        var comments = e.currentTarget.parentNode.previousElementSibling.value.trim();
        
        var tableEle = e.target.parentElement.parentElement.parentElement.parentElement.parentElement;
        var $table = $(tableEle);
        console.log(tableEle);

        if(comments){
            
            // 1.有多选
            if (row["14"]||row["13"]) {
                console.log($table.bootstrapTable('getSelections'));
                var Selections = $table.bootstrapTable('getSelections');

                var casesData = [];
                Selections.forEach(function (newRow) {

                    casesData.push({
                        caseUrl: getResultCaseUrl(newRow),
                        userComment: comments
                    });

                    return;
                    sendUserCaseRequest({
                        caseUrl: getResultCaseUrl(newRow),
                        userComment: comments,
                    });
                    // selectWithComments(e, $table, row, row, comments);
                });
                sendCasesCheckReq({
                    cases: casesData
                });

            } 
            // 2.无多选
            else{
                sendUserCaseRequest({
                    caseUrl: getResultCaseUrl(row),
                    userComment: comments,
                });
                // selectWithComments(e, $table, row, row, comments);

            }
        }
    },
    'change input': function (e, value, row, index) {
        var isConfirm = e.currentTarget.checked;
        console.log(row);
        console.log("Is AI correct: ", isConfirm);
        
        var tableEle = e.target.parentElement.parentElement.parentElement.parentElement;
        var $table = $(tableEle);
        console.log($table);

        row.isConfirm = isConfirm; // 用户更新table 视图
        

        if(isConfirm){

            
            sendUserCaseRequest({
                caseUrl: row.caseUrl,
                checkClass: "default",
            });
            
            sendConfirm(row.caseUrl, isConfirm);
            

        } else {

            sendConfirm(row.caseUrl, isConfirm);

        }
        
        $table.bootstrapTable('updateRow', {
            "#": row["#"],
            row: row
        });
    }
    
}


/**
 * Confirm that all cases are checked. 
 * @param {String} batchUrl failed link
 * @param {Boolean} isConfirm true or false
 */
function sendAllConfirm(caseUrl, isConfirm){

    var param = {
        "batchUrl": caseUrl, "isConfirm": isConfirm 
    };
    
    param.user = getCookie("AptUsername");
    var request = $.ajax({
        url: "http://135.252.218.106:18081/api/web/confirm",
        method: "POST",
        contentType: "application/json",
        crossDomain:true,
        data: JSON.stringify(param)
    });
    request.done(function( response ) {
        console.log(response);
    });
    request.fail(function ( jqXHR, textStatus ) {
        console.log( "Request failed: " + textStatus );
    });
}

/**
 * 提交 isConfirm 字段
 * @param {String} caseUrl failed link
 * @param {Boolean} isConfirm true or false
 */
function sendConfirm(caseUrl, isConfirm){

    var param = {
        "caseUrl": caseUrl, "isConfirm": isConfirm 
    };
    param.user = getCookie("AptUsername");
    var request = $.ajax({
        url: "http://135.252.218.106:18081/api/web/caseconfirm",
        method: "POST",
        contentType: "application/json",
        crossDomain:true,
        data: JSON.stringify(param)
    });
    request.done(function( response ) {
        console.log(response);
    });
    request.fail(function ( jqXHR, textStatus ) {
        console.log( "Request failed: " + textStatus );
    });
}

function getResultCaseUrl(row){
    var status = row["Status"];
    var href = status.split('"')[1];
    href = getQueryString(href).href;
    return href;
}

function selectWithComments (e, $table, row, newRow, comments){

    var aTag = '';
    if(!row["Status"]){
        return;
    }
    console.log(e.target.parentElement.previousElementSibling.previousElementSibling);
    var selectVal = e.target.parentElement.previousElementSibling.previousElementSibling.children[0].value.toLowerCase();
    var status = row["Status"];
    var href = status.split('"')[1];
    var href = DeleteParam(href, 'select');
    href = href + "&select=" + selectVal + "&comments="+comments;
    // console.log(href);
    if (row["Status"].includes("FAIL")) {
        aTag = '<a href="'+href+'" target="_blank"><font color="red">FAIL</font></a>';
    }
    if (row["Status"].includes("BLOCKED")) {
        aTag = '<a href="'+href+'" target="_blank"><font color="block">BLOCKED</font></a>';
    }
    
    // console.log(aTag);
    row["Status"] = aTag;
    row.labeling = selectVal;
    row.userComment = comments;
    updateCurrentRow($table, row, newRow);
}

function selectWithoutComments(e, $table, row, newRow){

    var aTag = '';
    if(!row["Status"]){
        return;
    }
    var status = row["Status"];
    var href = status.split('"')[1];
    var href = DeleteParam(href, 'select');
    var href = DeleteParam(href, 'comments');
    href = href + "&select=" + e.target.value.toLowerCase();
    console.log(href);
    if (row["Status"].includes("FAIL")) {
        aTag = '<a href="'+href+'" target="_blank"><font color="red">FAIL</font></a>';
    }
    if (row["Status"].includes("BLOCKED")) {
        aTag = '<a href="'+href+'" target="_blank"><font color="block">BLOCKED</font></a>';
    }
    console.log(aTag);
    row["Status"] = aTag;
    row.labeling = e.target.value.toLowerCase();
    updateCurrentRow($table, row, newRow);
}

function updateCurrentRow($table, row, newRow){
    
    $table.bootstrapTable('updateRow', {
        "#": newRow["#"],
        row: newRow
    })
}

/**
 * 向后台发送用户选择的case
 * @param {*} paramData 
 */
function sendUserCaseRequest(paramData){
    // var loglink = 'loglink';
    // var checkClass = 'case_cfg_env';
    // var userComment = 'userComment';
    paramData.user = getCookie("AptUsername");
    var url = 'http://135.252.218.106:18081/api/web/check';
    var request = $.ajax({
        url: url,
        method: "POST",
        data: JSON.stringify(paramData),
        contentType: "application/json"
    });
    request.done(function( data ) {
        console.log(data);
        // alert('success');
        
    });
    request.fail(function ( jqXHR, textStatus ) {
        console.log( 'failure' );
        // alert('failure');
    })
}

/**
 * 批量发送case
 * @param {*} paramData [{},{},{}]
 */
function sendCasesCheckReq(paramData){
    paramData.user = getCookie("AptUsername");
    var url = 'http://135.252.218.106:18081/api/web/casescheck';
    var request = $.ajax({
        url: url,
        method: "POST",
        data: JSON.stringify(paramData),
        contentType: "application/json"
    });
    request.done(function( data ) {
        console.log(data);
        // alert('success');
        
    });
    request.fail(function ( jqXHR, textStatus ) {
        console.log( 'failure' );
        // alert('failure');
    })
}

/**
 * Refer to Cell Style of BT
 * @param {*} value 
 * @param {*} row 
 * @param {*} index 
 */
function cellStyle(value, row, index) {
    var classes = [
        'bg-lightblue',
        'bg-green',
        'bg-orange',
        'bg-yellow',
        'bg-red'
    ]
    
    if(row["Status"].includes("FAIL") || row["Status"].includes("BLOCKED")){
        return {
            // classes: classes[index / 2]
            classes: classes[0]
        }

    } else {
        return {
            classes: ''
        }
    }


    // return {
    //     css: {
    //         color: 'blue'
    //     }
    // }
}


/**
 * 创建统计图
 * @param {object} data 
 */
function createStatisticChart(oldData){
    var data = oldData;
    // console.log(data);

    // #FF5151 #F75000 #FF8040 #3E5ABC #3E5ABC #3E5ABC

    // productIssueNum: '#3E5ABC',
    // traffic_verify_issue: '#F75000',
    // configurationIssueNum: '#FF8040',
    // platformIssueNum: '#FF5151',
    // connectionIssueNum: '#3E5ABC',
    // instrumentIssueNum: '#3E5ABC'
    var colorList = {
        apt_issue: '#3E5ABC',
        traffic_verify_issue: '#F75000',
        case_cfg_env: '#FF8040',
        ne_issue: '#FF5151',
        ne_connection: '#3E5ABC',
        instrument: '#3E5ABC'
    };
    var html = '';
    var issueSum = data.issueSum;
    if(issueSum && issueSum.hasOwnProperty){
        // var productIssueNum = issueSum.productIssueNum;
        // var trafficIssueNum = issueSum.trafficIssueNum;
        // var configurationIssueNum = issueSum.configurationIssueNum;
        // var platformIssueNum = issueSum.platformIssueNum;
        // var connectionIssueNum = issueSum.connectionIssueNum;
        // var instrumentIssueNum = issueSum.instrumentIssueNum;
        var li = '';
        var txt = '';
        var color = '';
        for (var key in issueSum) {
            if (issueSum.hasOwnProperty(key)) {

                if(key == 'total') continue;

                var element = issueSum[key];

                color = colorList[key];

                if(key == 'ne_issue'){
                    txt='Product <br/>'+
                        'Defects';
                }
                if(key == 'traffic_verify_issue'){
                    txt='Traffic <br/>'+
                        'Issue';
                }
                if(key == 'case_cfg_env'){
                    txt='Configuration <br/>'+
                        'Issue';
                }
                if(key == 'apt_issue'){
                    txt='Platform <br/>'+
                        'Issue';
                }
                if(key == 'ne_connection'){
                    txt='Connection <br/>'+
                        'Issue';
                }
                if(key == 'instrument'){
                    txt='Instrument <br/>'+
                        'Issue';
                }
                // txt = key;
                li+='<li>'+
                        '<div class="item">'+
                            '<div class="number">'+element+'</div>'+
                            '<div class="txt" style="background:'+ color +'">'+
                                '<div class="txt-center">'+
                                    txt +
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</li>'
            }
        }
        

        html = [
            '<ul class="statistics clearfix">',
                li,
                // '<li>',
                //     '<div class="item">',
                //         '<div class="number">14</div>',
                //         '<div class="txt">',
                //             'Product <br/>',
                //             'Defects ',
                //         '</div>',
                //     '</div>',
                // '</li>',
            '</ul>'
        ].join("")
    }
    $('.header .statistics-box').append(html);

}

/**
 * 创建多个分类table
 * @param {object} data 
 * @param {object} summaryData 
 */
function createCategoryTable(data, summarytableData){
    var categoryData = data;
    var summaryData = summarytableData;
    // console.log(categoryData);
    var categoryIndex = 1;
    

    for (var j in data) {
        if (data.hasOwnProperty(j) && j!='issueSum' && j!='classes' && j!='isConfirm') {
            var issue = data[j];
            var itemdata = issue;
            console.log("---itemdata---", itemdata);
            console.log("---summaryData---", summaryData);
            /**
             * 重写itemdata
             * "<a href="./page2.html?href=http://aptshanghai.cn.alcatel-lucent.com/~build_load/QFA/SH_TARG_SVT_BUILD_SANITY_4/SH_LOAD_SANITY_FOADM3/191203103854/logs/falcon_load_OADM_common_download_Testcase-1" target="_blank"><font color="red">FAIL</font></a>"
             */
            var createItemdata = function (itemdata,summaryData){
                var newItemdata = [];
                summaryData.forEach(function(ele, index) {
                    for (var key in itemdata) {
                        var ele2 = itemdata[key];
                        // console.log(ele.status);
                        if(ele["Status"].includes('FAIL') || ele["Status"].includes('BLOCKED') ){
                            
                            var eleHref = ele["Status"].split('"')[1].trim();
                            if(eleHref.includes("page2")){
                                var myHref = getQueryString(eleHref).href;
                                // console.log(myHref);
                                // console.log(ele2.caseUrl);
                                if(ele2.caseUrl.endWith(linkFormatter(myHref))){
                                // if(ele2.caseUrl.includes(myHref)){
                                // if( myHref+"/" == ele2.caseUrl ){
                                    ele["checkClass"] = ele2.checkClass;
                                    ele["userComment"] = ele2.userComment;
                                    ele["isConfirm"] = ele2.isConfirm;
                                    ele["caseUrl"] = ele2.caseUrl;
                                    ele.prediction = optionList[j];
                                    newItemdata.push( ele );
                                }

                            }
                        }
                    }
                });
                return newItemdata;
            }
            itemdata = createItemdata(itemdata, summaryData);
            console.log(itemdata);
            
            var createhtml = function(){
                var thList = '';
                // globalColumns.forEach(function(columns, index) {
                //     thList += '<th data-field="'+columns+'" data-width="175"  data-align="left">'+columns+'</th>';
                    
                // });
                thList = createThList(true);


                // className categoryTable1 ,..., categoryTablen
                var html =  [
                            '<div class="secondary-title">',
                                '<span style="background: '+colorList[j]+';">'+optionList[j]+'</span>',
                                '<span style="background: '+colorList[j]+';">',
                                    data['issueSum'][j],
                                '</span>',
                            '</div>',
                                '<table class="table categoryTable'+categoryIndex+' table-sm table-bordered">',
                                    '<thead>',
                                    '<tr>',
                                        thList,
                                        // '<th data-field="profile" data-width="175"  data-align="left">Profile</th>',
                                        // '<th data-field="number" data-width="23" data-align="center">#</th>',
                                        // '<th data-field="test" data-width="290"   data-align="left">Test</th>',
                                        // '<th data-field="config"  data-width="290"  data-align="left">Config</th>',
                                        // '<th data-field="options" data-width="196"  data-align="left">Options</th>',
                                        // '<th data-field="starttime" data-width="100"  data-align="left">StartTime - new</th>',
                                        // '<th data-field="elapsed" data-width="65" >Elapsed</th>',
                                        // '<th data-field="ConfirmedMRs" data-width="110" >Confirmed MRs</th>',
                                        // '<th data-field="status" data-width="70" ',
                                        //     'data-formatter="statusFormatter" ',
                                        //     'data-events="operateFAILEvent">',
                                        //     'Status',
                                        // '</th>',
                                        // '<th data-field="results" data-width="178" >Results(Pass/Fail/Skip)</th>',
                                        // '<th data-field="runDetails" data-width="90" >Run Details</th>',
                                        // '<th ',
                                        //     'class="prediction"',
                                        //     'data-width="120"',
                                        //     'data-cell-style="cellStyle"',
                                        //     'data-field="prediction" ',
                                        //     'data-align="center" ',
                                        //     'data-formatter="aiClassificationFormatter">',
                                        //     'AI Classification',
                                        // '</th>',
                                        // '<th ',
                                        //     'data-cell-style="cellStyle"',
                                        //     'data-width="120"',
                                        //     'data-field="labeling" ',
                                        //     'data-align="center" ',
                                        //     'data-formatter="labelingFormatter" ',
                                        //     'data-events="operateEvents">',
                                        //     'user Proposed Case',
                                        // '</th>',
                                    '</tr>',
                                '</thead>',
                            '</table>',
                            '<div class="margin-bottom40"></div>'
                            ];
                return html.join('');
            }
            var categoryContent = createhtml();
            
            $('.category').append(categoryContent);
            
            $('.categoryTable'+categoryIndex).bootstrapTable({
                // classes: classes,
                // columns: itemColumn,
                data: itemdata
            });
            categoryIndex++;
            
        }
    }

    
    // var confirmAll =  document.getElementById("confirmAll");
    var submitConfirm = $("#submitConfirm");
    var confirmAll = $("#confirmAll");
    // console.log(confirmAll);
    
    submitConfirm.click(function(){
        var checked = confirmAll.prop("checked")
        console.log("Confirm All: ", checked);
        // console.log(categoryData);
        var batchUrl = getLocationHref();
        sendAllConfirm(batchUrl, checked);

        return;

        // var paramData = [];
        // for (var key in categoryData) {
        //     if (categoryData.hasOwnProperty(key)) {
        //         if(key == "classes" || key == "issueSum") continue;
        //         var classElement = categoryData[key];
        //         classElement.forEach(item => {
        //             paramData.push({
        //                 caseUrl: item.caseUrl,
        //                 isConfirm: checked,
        //                 checkClass: "default"
        //             });
        //         });
        //     }
        // }
        // console.log(paramData);
        // return;

        itemdata.forEach(function(item, index){
            item.isConfirm = checked;
            var caseUrl = item.caseUrl;
            var isConfirm = checked;
            //全选提交 Is AI correct
            sendConfirm(caseUrl, isConfirm);
            
            // 当全选为 true 时， checkClass 需要设置为default
            if(checked){
                item.checkClass = "default";
                sendUserCaseRequest({
                    caseUrl: item.caseUrl,
                    checkClass: "default",
                });
            }
        });

        // 刷新table视图
        // console.log(itemdata); itemdata => row.isConfirm
        for(var i=0; i<categoryIndex; i++){
            if($('.categoryTable'+i).length == 0) continue;
            $('.categoryTable'+i).bootstrapTable('refreshOptions', {
                // classes: classes,
                // columns: itemColumn,
                data: itemdata
            });
        }
        alert('Feedback succeed.');

    });
}

function statusFormatter(value, row, index){
    // return value;
    if(!value.includes("FAIL") || !value.includes("BLOCKED")){
        return value;
    }
    // console.log(value);
    // console.log(row);
    // console.log(index);
    var html = [
        '<div class="status-fail">',
            value,
        '</div>',
    ].join('');
    // <div class="status-fail"><a href="./page2.html?http://aptshanghai.cn.alcatel-lucent.com/~build_load/QFA/SH_TARG_SVT_BUILD_SANITY_4/SH_LOAD_SANITY_FOADM/191203212924/logs/falcon_load_OADM_common_check_Testcase-1" target="_blank"><font color="red">FAIL</font></a></div>
    return html;
}

/**
 * 为 .status-fail 添加 点击事件
 */
var operateFAILEvent = {
    'click .status-fail': function (e, value, row, index) {
        failClickTrack(row);
    }
}
/**
 * 登录功能
 */
function LoginFunction(){
    var AptUsername = '';
    var AptToken = '';

    AptUsername = getCookie("AptUsername");
    
    if (AptUsername && AptUsername!="undefined") {
        $(".user-info .name").html("Welcome " + AptUsername);
        $(".user-info").show();
    } else {
        $('#exampleModalLong').modal('show');
    }
    

    $("#username").on('change', function(){
        $("#message").html("");
    });
    $("#password").on('change', function(){
        $("#message").html("");
    });

    $('#submit').on('click', function(){
        var username = $("#username").val();
        var password = $("#password").val();
        // alert("username: "+username + "\n" + "password: " +password);
        if(!username || !password){
            $("#message").html("Please enter the correct account and password.");
            return;
        }

        var url = 'http://135.252.218.106:18081/api/web/auth';
        var method = 'POST';
        var param = {
            username: username ,
            password: password
        }
        
        var request = $.ajax({
            url: url,
            method: method,
            contentType: "application/json",
            // crossDomain:true,
            data: JSON.stringify(param)
            // data: param
        });
        request.done(function( res ) {
            console.log(res);
            // alert(alert);
            if(res.isSuccess == 1){
                setCookie("AptUsername", res.user, 30);
                $("#username").val("");
                $("#password").val("");
                $('#exampleModalLong').modal('hide');
                $(".user-info .name").html("Welcome " + res.user);
                $(".user-info").show();
            } else {
                $("#message").html("Please enter the correct account and password.");
                // $("#username").val("");
                // $("#password").val("");
            }

        });
        request.fail(function ( jqXHR, textStatus ) {
            console.log( "Request failed: " + textStatus );
            // alert("Request failed: " + textStatus )
            $("#message").html("Please enter the correct account and password.");
            // $("#username").val("");
            // $("#password").val("");
        })
        
    });

    
    $('.logout').on('click', function(){

        delCookie("AptUsername");

        $(".user-info .name").html("");
        $(".user-info").hide();

        $("#message").html("");
        $('#exampleModalLong').modal('show');

    });
}


//用户行为记录跟踪
function fetchWholeBatch(){
    var timestamp = parseURL4TimeStamp();
    var srcData ={
        "timestamp":timestamp,
        "requestor":parseURL4Requestor()        
    }   
    $.ajax({
        async:true,
        type: "POST",
        url: HOST_RESTFUL+"/fetchWholeBatch",
        data: JSON.stringify(srcData),
        contentType:"application/json",                
        //ajax配合flask使用时下面2中跨域方法选其一，不可同时存在
        crossDomain:true,
        // beforeSend: function(xhr){
        //     xhr.withCredentials = true;
        // },
        error: function (request, status, error) { 
            // console.log(JSON.stringify(error)); 
        }
    });
}

function parseURL4TimeStamp() {
    var timestamp = null;
    try {
        var pathName = document.getElementsByTagName('a')[0].href;
        var logStr = pathName.substring(0,pathName.lastIndexOf("/logs"));
        var lastIndex = logStr.lastIndexOf("/");
        timestamp = logStr.substring(lastIndex+1);        
    } catch (error) {
        console.log(error)
    }
    return timestamp;
}

function parseURL4Requestor(){
    var requestor = null;
    try {
        var url = document.getElementsByTagName('a')[0].href;
        var str = url.substring(url.indexOf("/~")+2);
        requestor = str.substring(0,str.indexOf("/"));
    } catch (error) {
        console.log(error);
    }
    return requestor;
}


//对 FAIL 按钮进行事件跟踪
function failClickTrack(row) {
    console.log(row);
    var testHref = row.test.split('"')[1];
    console.log(testHref);
    var srcData = {
        "project": testHref.substring(0, testHref.indexOf("/~")),
        "html": testHref,
        "action":"Click_Failed_TestCase",
        "controllerId": testHref+"-FAIL0",
        "value": "FAIL",
        "trackValue": parseTrackValue(testHref),
        "requestor": parseRequestor(testHref),
        "testCase": parseTestCase(testHref),
        "config": parseConfigTitle(row.config),
    }
    console.log(srcData);
    
    // return;
    // var srcData = {
    //     "project":parseURL4Host(), //http://aptshanghai.cn.alcatel-lucent.com
    //     "html":parseURL4HtmlName(e,index),//http://aptshanghai.cn.alcatel-lucent.com/~build_load/QFA/SH_TARG_SVT_BUILD_SANITY_4/SH_LOAD_SANITY_FOADM3/191010151744/logs/falcon_load_OADM_common_provision_Testcase-2/testcase.html
    //     "action":ACTION_TRACK,
    //     "controllerId":parseEle4ControllerId(e,index),//http://aptshanghai.cn.alcatel-lucent.com/~build_load/QFA/SH_TARG_SVT_BUILD_SANITY_4/SH_LOAD_SANITY_FOADM3/191010151744/logs/falcon_load_OADM_common_provision_Testcase-2/testcase.html-FAIL0
    //     "value":parseEle4ControllerContent(e),//FAIL
    //     "trackValue":parseURL4TimeStamp(),//191010151744
    //     "requestor":parseURL4Requestor(),//build_load
    //     "testCase":parseTestCaseCol(e,index),//falcon_load_OADM_common_provision_Testcase
    //     "config":parseConfigCol(e,index) //falcon_load_OADM_protection_12p120_otu2_odukaps_pss168_Config.cfg
    //      //IE中必须设置中允许ActiveX控件才能获取其IP
    // }
    if(srcData.project == null
        || srcData.value == null
        || srcData.trackValue == null
        ){
            return;
    }
    $.ajax({
        async:true,
        type: "POST",
        url: HOST_RESTFUL+"/track",
        data: JSON.stringify(srcData),
        contentType:"application/json",                
        //ajax配合flask使用时下面2中跨域方法选其一，不可同时存在
        crossDomain:true,
        // beforeSend: function(xhr){
        //     xhr.withCredentials = true;
        // },
        error: function (request, status, error) { 
            console.log(JSON.stringify(error));
        }
    });  
}

function parseTrackValue(href){
    var str = "";
    str = href.substring(0, href.indexOf('/logs'));
    str = str.substring(str.lastIndexOf('/')+1, str.length);
    return str;
}

function parseRequestor(href){
    var str = "";
    str = href.substring(href.indexOf("/~")+2, href.length);
    str = str.substring(0, str.indexOf("/"));
    return str;
}

function parseTestCase(href){
    var str = "";
    str = href.substring(href.indexOf("logs/")+5, href.length);
    str = str.substring(0, str.indexOf("/"));
    return str;
}

function parseConfigTitle(config){
    var str = "";
    str = config.substring(config.indexOf("title=")+7, config.length);
    str = str.substring(0, str.indexOf('"'));
    return str;
}