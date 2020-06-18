
//向后台发送用户选择的case
var getUserCheckedUrl = 'http://135.252.218.106:18081/api/web/check';
//设置 test_case_results.html 的相对路径
var httpcontent = "./";

var queryParams = getQueryString(window.location.search);
var resultCaseUrl = queryParams.href; // 原FAIL详情页面url 不加 '/'
var prediction = queryParams.prediction;  //ai预测
var originLink = queryParams.originLink;  //原 fail-detail 加 '/'
$(function() {
    // init table
    var classes = 'table-sm table-bordered';
    $('#table').bootstrapTable({
        classes: classes,
        columns: [{
            field: 'result',
            title: 'Result',
            width: '50px',
            align: 'center',
            backgroundColor:'red'
        }, {
            field: 'step',
            title: 'Step',
            width: '70px',
            align: 'center'
        }, {
            field: 'info',
            title: 'Info',
        }, {
            field: 'time',
            title: 'Elapsed Time(hh:mm:ss)',
            width: '200px',
            align: 'center'
        }],
        // data: [{
        //   id: 1,
        //   name: 'Item 1',
        //   price: '$1'
        // }, {
        //   id: 2,
        //   name: 'Item 2',
        //   price: '$2'
        // }]
    });
    
    // resultCaseUrl = getResultCaseUrl();
    $iframe = $('#iframe');
    $iframe.attr('src', resultCaseUrl);
    // alert(resultCaseUrl)
    getStatusHtml();

    $('#table2').bootstrapTable({
        classes: classes,
        data: [{
          id: 1,
          name: 'Item 1',
          prediction: 'Item 1',
          labeling: 'Item 1',
        }]
    });
    
})

/**
 * extend table cell
 * @param {*} index 
 * @param {*} row 
 */
function detailFormatter(index, row) {
    console.log(index);
    console.log(row);
    var html = [];
    html.push( getActualHtml(row) );
    
    // var html = []
    // $.each(row, function (key, value) {
    //     html.push('<p><b>' + key + ':</b> ' + value + '</p>')
    // })
    return html.join('')
}

function getResultCaseUrl() {
	var url  = window.location.search.substring(1);
	
	if (!url) {
	    var hash = window.location.hash;
	    url = hash.slice(hash.indexOf('?') + 1);
	}
	
	return url.replace('?', '');
}


/**
 * getStatusHtml 
 */
function getStatusHtml(){
    // var statusUrl = resultCaseUrl + "/status.html";
    var statusUrl = getStatusUrl();
    function getStatusUrl(){
        if(location.href.includes('127.0.0.1')){
            statusUrl = httpcontent+"Test%20Results_files/status.html"; 
            return statusUrl;
        }
        statusUrl = originLink+"/status.html";
        return statusUrl;

    }
    
    // alert(statusUrl);
    var request = $.ajax({
        url: statusUrl,
        method: "GET",
    });
    
    request.done(function( data ) {
        // $( "#log" ).html( msg );
        // console.log(data);
        var statusTableData = getStatustableData(data);
        var failData = getFailData(statusTableData);
        
        // set data for table
        $('#table').bootstrapTable('refreshOptions', {
            // colums: [{
            //     field: 'result',
            //     title: 'Result',
            // }, {
            //     field: 'step',
            //     title: 'Step',
            // }, {
            //     field: 'info',
            //     title: 'Info',
            // }, {
            //     field: 'time',
            //     title: 'Elapsed Time(hh:mm:ss)',
            // }],
            data: failData
        });


    });
    
    request.fail(function( jqXHR, textStatus ) {
        console.log( "Request failed: " + textStatus );
    });
}

/**
 * get Status table Data
 * @param {*} html 
 */
function getStatustableData(html){
    var outDoc = new DOMParser().parseFromString(html, 'text/html');
    // console.log(outDoc);
    var  $table = $(outDoc).find('body').children('table');
    // console.log($table);
    var content = $table[0];
    // console.log(content);
    
    return content;
}

/**
 * getFailData
 * @param {*} tableData 
 */
function getFailData(tableData){
    var table =  $(tableData).children();
    var tbody =  $(table[1])[0];
    // var tbody = table.children
    // console.log(table);
    // console.log(tbody);
    // console.log(tbody.children);
    // 找到Fail的step
    var failArr = [];
    var id = 1;
    tbody.children.forEach(function (tr, trIndex){
        tr.children.forEach(function(td){
            var failureClass = td.getElementsByClassName('failure');
            var failTxt = $(failureClass[0]).text();
            // find Fail step tr 
            if(failureClass.length != 0 && failTxt == "Fail"){
                // console.log(failureClass);
                // console.log(tr);
                // console.log(td);
                // 查找td中的数据
                // td.
                // console.log($(tr)[0].children);
                var tdList = $(tr)[0].children;
                var a = $(tdList[1]).find('a');
                var href = a.attr('href');
                var step = a.attr('title');
                // console.log(a);
                // console.log(href);
                // console.log(step);
                var stepTd = $(tdList[2]).find('tr')[0].children[1];
                var stepInfo =$(stepTd).text();
                // console.log(stepInfo);
                var timeTd = $(tdList[3]).find('td')[0];
                var steptime = $(timeTd).text();
                // console.log(timeTd);
                // console.log(steptime);
                failArr.push({
                    id: id,
                    result: failTxt,
                    step: step,
                    info: stepInfo,
                    time: steptime,
                    stepNum: trIndex+1
                });
                id++;
            }
        })
    })
    // console.log(failArr);
    return failArr;
}

function getActualHtml(row){
    console.log(row);
    // var step = +row.step.substring(row.step.length-1, row.step.length)+1;
    // console.log(step);
    var src = originLink + "actual-1-"+row.stepNum+".html";
    var iframe = '<iframe src="'+src+'" border="0" style="border-width: 0;"></iframe>';
    console.log(iframe);
    return iframe;
}

function aiClassificationFormatter(value, row, index){
    // console.log(row);
    var html = '';
    
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
    html =  [
        '<div style="font-size: 16px; color:#fff; ">',
            '<span class="badge" style="background-color:'+colorList[prediction]+';">',
                optionList[prediction],
            '</span>',
        '</div>'
    ].join("");
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
    // console.log(value);
    // console.log(row);
    // console.log(index);
    
    var html = '';
    var selectparam = getQueryString(document.location.href).select;
    var comments = getQueryString(document.location.href).comments;

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
        for (var key in optionList) {
            if (optionList.hasOwnProperty(key)) {
                var value = optionList[key];
                var selected = "";
                if(key == selectparam){
                    selected = "selected";
                } 
                // if(row.checkClass == null && key == "default"){
                //     selected = "selected";
                // }
                // if (row.checkClass == key) {
                //     selected = "selected";
                // }
                myOptions += '<option '+selected+' value="'+key+'">'+value+'</option>';
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
    if(comments){
        showComments = 'block';
    } else{
        showComments = 'none';
    }
    html = [
        '<div class="form-group" style="width: 120px">',
            '<select id="inputState"',
                'class="form-control form-control-sm">',
                options ,
            '</select>',
        '</div>',
        '<textarea style="display:'+showComments+'" class="textarea" name="" id="" cols="30" rows="10" >'+comments+'</textarea>',
        '<div class="submit-box clearfix" style="display:'+showComments+'" >',
            '<button type="submit">submit</button>',
        '</div>',
    ].join('');
    
    return html;
}

/**
 * refer to  Column Events of BT
 */
var operateEvents = {
    'change select': function (e, value, row, index) {
            // console.log(e);
            // console.log(e.target.value);
            // console.log(value);
            // console.log(row);
            // console.log(index);
            if(e.target.value.toLowerCase() == 'default'){
                return;
            }
            var selVal = "";
            var comment = "";
            
            if(e.target.value.toLowerCase() == 'others'){
                e.target.parentNode.nextElementSibling.style.display = 'block'
                e.target.parentNode.nextElementSibling.nextElementSibling.style.display = 'block'
                e.target.parentNode.nextElementSibling.focus();
                comment = e.target.parentNode.nextElementSibling.value;
            } else {
                e.target.parentNode.nextElementSibling.style.display = '';
                e.target.parentNode.nextElementSibling.nextElementSibling.style.display = ''
                selVal = e.target.value;
                sendUserCaseRequest({
                    caseUrl: getQueryString(Location.href).href,
                    checkClass: selVal,
                });
            }
    },
    'click button': function (e, value, row, index) {
        console.log(e.currentTarget.parentNode.previousElementSibling.value);
        var value = e.currentTarget.parentNode.previousElementSibling.value.trim();

        if(value){
            // ...
            console.log(value);
            sendUserCaseRequest({
                caseUrl: getQueryString(Location.href).href,
                userComment: value,
            });
        }
    },
}

function getResultCaseUrl(row){
    var status = row["Status"];
    var href = status.split('"')[1];
    href = getQueryString(href).href;
    return href;
}
  

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
        console.log("success");
        // alert('success');
        
    });
    request.fail(function ( jqXHR, textStatus ) {
        console.log( "failure" );
        // alert('failure');
    })
}