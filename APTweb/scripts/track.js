
// var HOST_RESTFUL="http://127.0.0.1:5000"
var HOST_RESTFUL="http://10.243.2.207:5000"
var ACTION_TRACK = "Click_Failed_TestCase";
window.onload=function (){ 
    // fetchWholeBatch();
    // addFailClickListener();
    // initListener()
};

function initListener(){
    fetchWholeBatch();
    addFailClickListener();
}

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
            console.log(JSON.stringify(error)); 
        }
    });
}

function getAllElementsWithAttribute(tag,attribute,value){
    var TEXT = "FAIL"
    var matchingElements = [];
    var allElements = document.getElementsByTagName(tag);
    for (var i = 0, n = allElements.length; i < n; i++){
        if (allElements[i].getAttribute(attribute) !== null 
            && allElements[i].getAttribute(attribute) == value
            && allElements[i].innerText == TEXT){
            // Element exists with attribute. Add to array.
            matchingElements.push(allElements[i]);
        }
    }
    return matchingElements;
}

function addFailClickListener(){
    // var failsArr = document.queryselectorall('a font[color=red]');
    var failsArr = getAllElementsWithAttribute("font","color","red");
    for (var index = 0; index < failsArr.length; index++) {
        var element = failsArr[index];
        element.addEventListener("click",function(e){
            console.log(failsArr.indexOf(this))
            failClickTrack(e,failsArr.indexOf(this))
        });
        
    }
}

function failClickTrack(e,index) {
    var srcData = {
        "project":parseURL4Host(), //http://aptshanghai.cn.alcatel-lucent.com
        "html":parseURL4HtmlName(e,index),//http://aptshanghai.cn.alcatel-lucent.com/~build_load/QFA/SH_TARG_SVT_BUILD_SANITY_4/SH_LOAD_SANITY_FOADM3/191010151744/logs/falcon_load_OADM_common_provision_Testcase-2/testcase.html
        "action":ACTION_TRACK,
        "controllerId":parseEle4ControllerId(e,index),//http://aptshanghai.cn.alcatel-lucent.com/~build_load/QFA/SH_TARG_SVT_BUILD_SANITY_4/SH_LOAD_SANITY_FOADM3/191010151744/logs/falcon_load_OADM_common_provision_Testcase-2/testcase.html-FAIL0
        "value":parseEle4ControllerContent(e),//FAIL
        "trackValue":parseURL4TimeStamp(),//191010151744
        "requestor":parseURL4Requestor(),//build_load
        "testCase":parseTestCaseCol(e,index),//falcon_load_OADM_common_provision_Testcase
        "config":parseConfigCol(e,index) //falcon_load_OADM_protection_12p120_otu2_odukaps_pss168_Config.cfg
         //IE中必须设置中允许ActiveX控件才能获取其IP
    }
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

function parseTestCaseCol(e,index){
    var testcase = null;
    try {
        var eventEle= e || window.event;
        var target = eventEle .target || eventEle .srcElement; //获取document 对象的引用;
        var tr = target.parentElement.parentElement.parentElement;
        var tds = tr.getElementsByTagName("td");
        testcase = tds[1].getElementsByTagName('a')[0].innerText;
    } catch (error) {
        console.log(error)
    }
    return testcase;
}
function parseConfigCol(e,index){
    var config = null;
    try {
        var eventEle= e || window.event;
        var target = eventEle .target || eventEle .srcElement; //获取document 对象的引用;
        var tr = target.parentElement.parentElement.parentElement;
        var tds = tr.getElementsByTagName("td");
        config = tds[2].getElementsByTagName('a')[0].innerText;        
    } catch (error) {
        console.log(error)
    }
    return config;
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


function parseURL4Host(){
    var projectHost = null
    try {
        var url = document.getElementsByTagName('a')[0].href;
        projectHost = url.substring(0, url.indexOf("/~"));        
    } catch (error) {
        console.log(error)
    }
    return projectHost;
}

function parseURL4HtmlName(e,index){
    var htmlName = null;
    try {
        var eventEle= e || window.event;
        var target = eventEle .target || eventEle .srcElement; //获取document 对象的引用;
        var tr = target.parentElement.parentElement.parentElement;
        var tds = tr.getElementsByTagName("td");
        htmlName = tds[1].getElementsByTagName('a')[0].href;
    } catch (error) {
        console.log(error)
    }  
    return htmlName
}

function parseEle4ControllerId(e,index) {
    var id =null;
    try {
        var eventEle= e || window.event;
        var target = eventEle .target || eventEle .srcElement; //获取document 对象的引用;
        id = target.getAttribute("id");        
        if(null == id){
            id = parseURL4HtmlName(e,index)+"_"+parseEle4ControllerContent(e)+index;
        }
    } catch (error) {
        console.log(error)
    }
    return id;
}

function parseEle4ControllerContent(e){
    var content =null;
    try {
        var eventEle= e || window.event;
        var target = eventEle .target || eventEle .srcElement;
        content = target.innerText;        
    } catch (error) {
        console.log(error)
    }
    return content;
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