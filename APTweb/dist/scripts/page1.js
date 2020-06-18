//收集用户数据
var HOST_RESTFUL="http://10.243.2.207:5000";
//获取 Fail 的分类
var getCategoryUrl = 'http://135.252.218.106:18081/api/web/airesult';
//向后台发送用户选择的case
var getUserCheckedUrl = 'http://135.252.218.106:18081/api/web/check';
//获取 test_case_results.html 所在文件夹的绝对路径
var httpcontent = gethttpcontent();
var test_case_results = "test_case_results_bak.html";
//获取原网页log汇总链接 参数：原网页html名称 例如，test_case_results.html。 请重命名。
var GlobalLogUrl = getGlobalLogUrl(test_case_results);


var newData = [];
var globalColumns = [];
var categoryData = null;
$(function(){
    getPage1Html();

})
function gethttpcontent(){
    var href = location.href;
    return href.substring(0, href.indexOf("test_case_results.html"))
}

/**
 * 获取原网页log汇总链接
 */
function getGlobalLogUrl(filename){
    var httphref = document.location.href;
    if(httphref.includes('127.0.0.1')){
        return "http://135.252.217.201/~SHShelfTest02/QFA/SH_TARG_SVT_PTP/SH_DPEL2_PTP/191213030841/logs/"+test_case_results;
    }
    if(!httphref.includes('/logs/')){
        return httphref;
    }
    httphref = httphref.substring(0, httphref.indexOf('/logs/')+6) + test_case_results;
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
        // page1url = httpcontent + "test_case_results.html";
        page1url = httpcontent + test_case_results;
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
        location.href = httpcontent + "test_case_results_bak.html";
    })
}

function getStatustableData(html){
    var outDoc = new DOMParser().parseFromString(html, 'text/html');
    // console.log(outDoc);
    
    // console.log($table);
    // console.log($table.prevObject);
    
    // 设置header和footer
    seHeaderAndFooter( $(outDoc) );

    
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
    var method = 'POST';
    var ContentType = "application/json";
    var param = {
        url: GlobalLogUrl
    }
    
    var request = $.ajax({
        url: getCategoryUrl,
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
        location.href = httpcontent + "test_case_results_bak.html";
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


function createThList(){
    var thList = '';
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
        },

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

    //...这段代码用于给 href 添加 prediction 字段
    var originLink = location.href.substring(0, location.href.indexOf("/logs/") + 6);

    for (var outkey in categoryData) {
        if (categoryData.hasOwnProperty(outkey) && outkey!='issueSum' && outkey!='classes') {
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
                            if(subItem.caseUrl.includes(linkFormatter(oldhref)+'/')){
                                oldhref = subItem.caseUrl;
                                var href = "./page2.html?prediction="+ outkey + "&href=" + oldhref + "&originLink=" + subItem.caseUrl;
                                record["Status"] = '<a href="'+href+'" target="_blank"><font color="red">FAIL</font></a>';
                            }

                        }
                    });
                }
            }
            
        }
    }
    
}

function linkFormatter(oldhref){
    var httphref = '';
    if(oldhref.includes('http')){
        return oldhref;
    }
    if(oldhref.includes('../')){
        // httphref = document.location.href;
        // oldhref = oldhref.substring(oldhref.lastIndexOf("/logs/")+5, oldhref.length-1);
        // httphref = httphref.substring(0, httphref.indexOf('/logs')+6) + oldhref;
        httphref = oldhref.substring(oldhref.lastIndexOf("..")+2, oldhref.length);

        return httphref;
    }
    if(oldhref.includes('./')){
        httphref = oldhref.substring(oldhref.indexOf(".")+1, oldhref.length);

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
    // 创建分类html结构及分类table 
    createCategoryTable(categoryData, summarytableData);
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
    if(row["Status"].includes("FAIL")){
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
    if(row["Status"].includes("FAIL")){
        if(!value){
            value = '';
        }
        console.log(value);
        console.log(row);

        function createSelectOptions(){
            // var myOptions = '<option value="---NULL---">---NULL---</option>';
            var myOptions = '';
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
            if (!value) {
                for (var key in optionList) {
                    if (optionList.hasOwnProperty(key)) {
                        var element = optionList[key];
                        var selected = "";
                        if (row.checkClass == key) {
                            selected = "selected";
                        }
                        myOptions += '<option '+selected+' value="'+key+'">'+element+'</option>';
                    }
                }
            }
            if(value) {
                for (var key in optionList) {
                    if (optionList.hasOwnProperty(key)) {
                        var element = optionList[key];
                        var selected = "";
                        if(value == key){
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
        if(row.comments){
            showComments = 'block';
        } else{
            showComments = 'none';
            row.comments = '';
        }
        html = [
            '<div class="form-group" style="width: 120px">',
                '<select id="inputState"',
                    'class="form-control form-control-sm">',
                    options ,
                '</select>',
            '</div>',
            '<textarea style="display:'+showComments+'" class="textarea" name="" id="" cols="30" rows="10" >'+row.comments+'</textarea>',
            '<div class="submit-box clearfix" style="display:'+showComments+'" >',
                '<button type="submit">submit</button>',
            '</div>',
        ].join('');
        
        return html;
    }

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
            // console.log(row);
            // console.log(index);
            // console.log(row["Status"]);
            if(e.target.value.toLowerCase() == 'default'){
                return;
            }
            
            var tableEle = e.target.parentElement.parentElement.parentElement.parentElement.parentElement;
            var $table = $(tableEle);
            // console.log(tableEle);



            var selVal = "";
            var comments = "";
            // console.log("newData:", newData);
            
            // console.log("categoryData:", categoryData);
            
            
            if(e.target.value.toLowerCase() == 'others'){
                e.target.parentNode.nextElementSibling.style.display = 'block'
                e.target.parentNode.nextElementSibling.nextElementSibling.style.display = 'block'
                e.target.parentNode.nextElementSibling.focus();
                comments = e.target.parentNode.nextElementSibling.value||"";
                console.log(comments);
                
            } else {
                console.log(e.target.value);
                console.log(e);
                console.log(row);
                row.comments = null; //清空输入的comments
                e.target.parentNode.nextElementSibling.style.display = '';
                e.target.parentNode.nextElementSibling.nextElementSibling.style.display = '';
                selVal = e.target.value;
                sendUserCaseRequest({
                    caseUrl: getResultCaseUrl(row),
                    checkClass: selVal,
                });
                selectWithoutComments(e, $table, row, index);
            }
    },
    'click button': function (e, value, row, index) {
        // console.log(e.currentTarget.parentNode.previousElementSibling.value);
        var comments = e.currentTarget.parentNode.previousElementSibling.value.trim();
        
        var tableEle = e.target.parentElement.parentElement.parentElement.parentElement.parentElement;
        var $table = $(tableEle);
        console.log(tableEle);

        if(comments){
            // ...
            // console.log(value);
            sendUserCaseRequest({
                caseUrl: getResultCaseUrl(row),
                userComment: comments,
            });
            selectWithComments(e, $table, row, index, comments);
        }
    },
}

function getResultCaseUrl(row){
    var status = row["Status"];
    var href = status.split('"')[1];
    href = getQueryString(href).href;
    return href;
}

function selectWithComments (e, $table, row, index, comments){

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
    aTag = '<a href="'+href+'" target="_blank"><font color="red">FAIL</font></a>';
    // console.log(aTag);
    row["Status"] = aTag;
    row.labeling = selectVal;
    row.comments = comments;
    updateCurrentRow($table, row, index);
}
function selectWithoutComments(e, $table, row, index){

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
    aTag = '<a href="'+href+'" target="_blank"><font color="red">FAIL</font></a>';
    console.log(aTag);
    row["Status"] = aTag;
    row.labeling = e.target.value.toLowerCase();
    updateCurrentRow($table, row, index);
}

function updateCurrentRow($table, row, index){
    
    $table.bootstrapTable('updateRow', {
        index: index,
        row: row
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
    var request = $.ajax({
        url: getUserCheckedUrl,
        method: "POST",
        data: JSON.stringify(paramData),
        contentType: "application/json"
    });
    request.done(function( data ) {
        console.log('success');
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
    
    if(row["Status"].includes("FAIL")){
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

    for (var j in data) {
        if (data.hasOwnProperty(j) && j!='issueSum' && j!='classes') {
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
                        if(ele["Status"].includes('FAIL')){
                            
                            var eleHref = ele["Status"].split('"')[1].trim();
                            if(eleHref.includes("page2")){
                                var myHref = getQueryString(eleHref).href;
                                // console.log(myHref);
                                // console.log(ele2.caseUrl);
                                if( ele2.caseUrl.includes(linkFormatter(myHref)) ){
                                    ele["checkClass"] = ele2.checkClass;
                                    ele["userComment"] = ele2.userComment;
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
                globalColumns.forEach(function(columns, index) {
                    thList += '<th data-field="'+columns+'" data-width="175"  data-align="left">'+columns+'</th>';
                    
                });
                thList = createThList();

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
}

function statusFormatter(value, row, index){
    // return value;
    if(!value.includes("FAIL")){
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