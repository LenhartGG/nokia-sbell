function alertError(){
    swal({
        type: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      })
}

function alertSuccess(msg){
    swal({
        type: 'success',
        title: 'Success',
        text: msg        
      })     
}
function alertWarning(msg){
    swal({
        type: 'notice',
        title: 'Notice',
        text: msg
    })
}
  
/**
 * 考虑兼容性的触发单击事件
 * @param elem 要触发单击事件的DOM对象
 */
function fireClickEvent(elem){
    var event;
    if(window.MouseEvent){
        event = new MouseEvent('click');
    }else{
        event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    
    elem.dispatchEvent(event);
}

/**
 * getdataList
 */
function getdataList(){
    $.ajax({
        type: "GET",
        url: "/checkin/fetchtype",
    })
    .done(function (response) {        
        if(response.status > 0){
            console.log(response.value)
            setdatalist('datalist_TYPE', response.value.TYPE)
            setdatalist('datalist_Application', response.value.Application)
            setdatalist('datalist_Fibertype', response.value.FiberConnectortype)
            setdatalist('datalist_SubApp', response.value.SubApp)
        }
    })
}
/**
 * setdatalist
 * @param {string} id 
 * @param {object} data 
 */
function setdatalist(id, data){
    if( data ){
        var options = '';
        data.forEach(function(ele) {
            options += "<option value="+ ele.text +">";
            
        });
        $('#' + id).append(options);
    } else{
        console.log("===================================")
        console.log("There is no dataList!!!")
        console.log("===================================")
        return;
    }
    
}

/**
 * 将表格中的行数据（row=>values）渲染到弹出层
 * @param {str} divId 
 * @param {object} values 
 */
function setDetailInfo(divId, values){
    var div = document.getElementById(divId);
    var inputs = div.getElementsByTagName('input');
    var inputList = Array.prototype.slice.call(inputs);
    inputList.forEach(function(input) {
        var key = input.getAttribute('data-name');
        Object.keys(values).forEach(function(element){
            
            // 设置上传文件按钮状态 disabled
            setUploadFileDisable(input)
            if( key === element ){
                if(key == "Link3" || key == "Link4" || key == "Link5" || key == "Link6" || key == "Link7"){
                    var filename = values[element];
                    if( !filename ){
                        return;
                    }
                    filename = unescape(filename);
                    createDownloadTag({
                        input: input,
                        filename: filename
                    });
                    console.log(key + ":  " + filename);
                    return;
                }
                input.value = values[element];
                input.title = values[element];
                console.log(key + ":  " + input.value);
            }
        })
    });
}

/**
 * 创建下载链接
 * @param {object} arg contains input and filename
 */
function createDownloadTag(arg){
    var input = arg.input;
    var filename = arg.filename;
    var href = window.location.href;
    var hostname = href.substring(0, href.lastIndexOf('/') + 1 );
    var Tag_A = document.createElement("a");
    Tag_A.setAttribute('class', 'download');
    Tag_A.setAttribute('href', hostname + filename);
    Tag_A.setAttribute('download', filename); //下载文件属性
    // Tag_A.appendChild(document.createTextNode(filename));//添加文本信息
    var img = new Image();
    img.setAttribute('src', '../../images/download-image.png');
    img.setAttribute('title', filename);
    img.setAttribute('class', 'img-download');
    Tag_A.appendChild(img);
    input.parentElement.parentElement.appendChild(Tag_A);
    // 更换上传按钮信息
    input.nextSibling.innerHTML = filename;
}

/**
 * 设置上传文件按钮状态 disabled
 * @param {js-dom} input 
 */
function setUploadFileDisable(input){
    if(input && input.type == 'file'){
        var username = localStorage.username;
        var password = localStorage.password;
        var tokenId = localStorage.tokenId;
        var group = localStorage.group;
        // 登录状态检测
        if ( username && password && tokenId ) {
            if ( group == 1 ) {
                input.disabled = "";
            } else {
                input.disabled = "disabled";
            }
        } else {
            input.disabled = "disabled";
        }
    } else {
        return;
    }
}

/**
 * 获取url参数
 * @param {string} variable 
 */
function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){
            return unescape(pair[1]);
        }
    }
    return(false);
}

/**
 * getTokenId
 */
function getTokenId(){
    if( localStorage.getItem('tokenId') ){
        return JSON.parse(localStorage.getItem('tokenId')).value
    }
    return "";
}

/**
 * 
 * @param {object} arg 
 */
function Ajax(arg){

    $.ajax({
        url: arg.url,
        type: arg.type,
        data: arg.data || null,
        dataType: 'json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("tokenId", getTokenId());
        },
        // xhrFields:{ withCredentials:true },
        success: arg.success || null,
        error: arg.error || null
    });
}


/**
 * 跳转至登录界面并保存上一个页面的链接用来重定向url
 */
function jumpToLogin(){
    var redirect = location.href;
    window.location.href = "users" + "?redirect=" + escape(redirect);
}


/**
 * 保存用户信息到本地
 * @param {Object} arg 
 */
function storeAdmin(arg){
    console.log("storeAdmin---" + JSON.stringify(arg));
    localStorage.username = arg.username;
    localStorage.password = arg.password;
    localStorage.group = arg.group;
    localStorage.fullname = arg.fullname;
    localStorage.tokenId = JSON.stringify(arg.tokenId);
    // autoLogin
    sessionStorage.login_flag = true;
}
/**
 * 删除本地的用户信息
 */
function removeAdmin(){
    var userArr = ['username', 'password', 'group', 'fullname', 'tokenId'];
    userArr.forEach(function(ele) {
        if (localStorage[ele]) {
            localStorage.removeItem(ele);
        }
    });
}


/**
 * 检索用户登录状态和权限
 * @param {Object} arg 
 */
function checkdata(arg){
    var selectNumber = 0;
    if($('input[name="avatar3"]').val()){
        selectNumber +=1;
    }
    if($('input[name="avatar4"]').val()){
        selectNumber +=1;
    }
    if($('input[name="avatar5"]').val()){
        selectNumber +=1;
    }
    if($('input[name="avatar6"]').val()){
        selectNumber +=1;
    }
    if($('input[name="avatar7"]').val()){
        selectNumber +=1;
    }
    console.log("本次提交文件数量: " + selectNumber);

    var username = localStorage.username;
    var password = localStorage.password;
    var tokenId = localStorage.tokenId;
    var group = localStorage.group;
    // 登录状态检测
    if ( username && password && tokenId ) {
        // 操作权限检测 0无 1有
        if ( group == 1 ) {
            storeDataToDB(arg, selectNumber)
        } else {
            alert("You Are Logged On As: " + username + ". Your access rights are not sufficient for the following action.Please contact yan.a.mei@nokia-sbell.com for permission.")
        }

    } else {
        alert('Please log in first')
        jumpToLogin()
        return;
    }
}
/**
 * 保存数据到数据库
 * @param {Object} arg 
 */
function storeDataToDB(arg, selectNumber){
    var srcData = {};

    var general = document.getElementById( arg.group1_tab1 );
    var detail = document.getElementById( arg.group1_tab2 );
    var generalInputs;
    var detailInputs;
    if(general){
        generalInputs = general.getElementsByTagName('input');
        generalInputs = Array.prototype.slice.call(generalInputs);
        generalInputs.forEach(function(input) {
            if( input.value ){
                var key = input.getAttribute("data-name");
                var value = input.value;
                srcData[key] = value;
            }
        });
    }

    if(detail){
        detailInputs = detail.getElementsByTagName('input');
        detailInputs = Array.prototype.slice.call(detailInputs);
        detailInputs.forEach(function(input) {
            if( input.value ){
                var key = input.getAttribute("data-name");
                var value = input.value;
                srcData[key] = value;
            }
        });
    }


    if(!srcData["APN"]){
        alertWarning("APN is empty!");
        return
    }
    var alertStr = '';  //未填字段提示信息
    var emptycount = 0;
    var emptyObj = createRequiredKeyAlertString(srcData, alertStr, emptycount);
    alertStr = emptyObj.alertStr;       //生成必填（未填）字段提示信息
    emptycount = emptyObj.emptycount;   //生成必填（未填）字段提示信息

    if (alertStr) {
        if(emptycount == 1){
            // alertWarning("This field is mandatory for check-in" + alertStr);
            // $("#emptyAlertModal").modal('show');
            alert("This field is mandatory for check-in:" + alertStr);
            return;
        }
        if(emptycount > 1){
            // alertWarning("These fields are mandatory for check-in" + alertStr);
            alert("These fields are mandatory for check-in:" + alertStr);
            return;
        }
    } else {
        var timeStamp = Date.now()
        var data = {
            timeStamp: timeStamp,
            selectNumber: selectNumber,
            srcData: srcData
        };
        if(arg.linkFormSubmitBtn1){
            document.getElementById( arg.linkFormSubmitBtn1 ).click();
            // fireClickEvent(document.getElementById( arg.linkFormSubmitBtn1 ));
        }
        $.ajax({
            type: "POST",
            url: "/checkin/checkInGroup",
            data: data
        })
        .done(function (response) {
            if(response.status > 0){
                APN_VALID = true;
                confirmAndDismissModal("Check in successfully!", arg.checkinModal1); //prompt and hide info
                if(window.Search){
                    Search();   //update table
                }
            }
        })
        .fail(function (error) {
            alertError();
        });
    }
}
/* 保存数据功能 end */

/**
 * 数据保存成功后的提示
 * @param {*} msg 
 * @param {*} modalId 
 */
function confirmAndDismissModal(msg,modalId){
    swal({
        title: 'Success',
        text: msg,
        type: 'success',
        confirmButtonText: 'OK'
      }).then(function(result) {
        if (result.value) {            
          $('#'+modalId).modal('hide');
        }
      })
}


/**
 * 生成必填（未填）字段提示信息
 * @param {Object} srcData 用户填写的数据
 * @param {String} alertStr 要弹出的提示信息
 * @param {Number} emptycount 未填字段个数
 */
function createRequiredKeyAlertString(srcData, alertStr, emptycount){
    var newStr = alertStr;
    var newCount = emptycount;
    var requiredKeyList = [{
        key: "APN",
        text: "APN",
    },{
        key: "TYPE",
        text: "TYPE"
    },{
        key: "Application",
        text: "Application"
    },{
        key: "SubApp",
        text: "SubApp"
    },{
        key: "Temperature",
        text: "Temperature"
    },{
        key: "Targetdistance",
        text: "Targetdistance"
    },{
        key: "Wavelength",
        text: "Wavelength"
    },{
        key: "FiberConnectortype",
        text: "Fiber type"
    },]
    requiredKeyList.forEach(function (element) {
        if (!srcData[element.key]){
            newStr += "\r\n" + element.text;
            newCount++;
        }
    });
    return {
        alertStr: newStr,
        emptycount: newCount
    };
}

/**
 * 在页面上检索apn
 * @param {*} apn 
 * @param {*} firstId 
 * @param {*} secondId 
 */
function selectAPN(apn,firstId, secondId){
    if(apn){
        $.ajax({
            type: "POST",
            url: "/checkin/selectAPN",
            data: {'APN':apn}
        })
        .done(function (response) {        
            if(response.status > 0){
                if(response.value){
                    setDetailInfo(firstId,response.value);
                    if( secondId ){
                        setDetailInfo(secondId,response.value);
                    }
                    APN_VALID= true;
                }else{
                    APN_VALID= false;
                    alertWarning('The APN is a new one!');
                }
            }
        })
        .fail(function (error) {
            alertError();
        });
    }else{
        alertWarning('APN cannot be empty!');
    }    
}

/**
 * 选择文件时显示文件名称
 */
function chooseFilename(){
    var file_avatar3 = $("input[name='avatar3']");
    var file_avatar4 = $("input[name='avatar4']");
    var file_avatar5 = $("input[name='avatar5']");
    var file_avatar6 = $("input[name='avatar6']");
    var file_avatar7 = $("input[name='avatar7']");
    file_avatar3.on('change', function( e ){
        //e.currentTarget.files 是一个数组，如果支持多个文件，则需要遍历
        var name = e.currentTarget.files[0].name;
        e.currentTarget.nextElementSibling.innerText = name;
        // alert(name);
    });
    file_avatar4.on('change', function( e ){
        //e.currentTarget.files 是一个数组，如果支持多个文件，则需要遍历
        var name = e.currentTarget.files[0].name;
        e.currentTarget.nextElementSibling.innerText = name;
        // alert(name);
    });
    file_avatar5.on('change', function( e ){
        //e.currentTarget.files 是一个数组，如果支持多个文件，则需要遍历
        var name = e.currentTarget.files[0].name;
        e.currentTarget.nextElementSibling.innerText = name;
        // alert(name);
    });
    file_avatar6.on('change', function( e ){
        //e.currentTarget.files 是一个数组，如果支持多个文件，则需要遍历
        var name = e.currentTarget.files[0].name;
        e.currentTarget.nextElementSibling.innerText = name;
        // alert(name);
    });
    file_avatar7.on('change', function( e ){
        //e.currentTarget.files 是一个数组，如果支持多个文件，则需要遍历
        var name = e.currentTarget.files[0].name;
        e.currentTarget.nextElementSibling.innerText = name;
        // alert(name);
    });

}

// Production steps of ECMA-262, Edition 6, 22.1.2.1
// Reference: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.from
if (!Array.from) {
    Array.from = (function () {
      var toStr = Object.prototype.toString;
      var isCallable = function (fn) {
        return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
      };
      var toInteger = function (value) {
        var number = Number(value);
        if (isNaN(number)) { return 0; }
        if (number === 0 || !isFinite(number)) { return number; }
        return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
      };
      var maxSafeInteger = Math.pow(2, 53) - 1;
      var toLength = function (value) {
        var len = toInteger(value);
        return Math.min(Math.max(len, 0), maxSafeInteger);
      };
      var toItems = function (value) {
        // support set
        if (value.size > 0 && value.values) {
          var values = value.values()
          var it = values.next()
          var o = []
          while (!it.done) {
            o.push(it.value)
            it = values.next()
          }
          return o
        }
        return Object(value);
      };
      // The length property of the from method is 1.
      return function from(arrayLike/*, mapFn, thisArg */) {
        // 1. Let C be the this value.
        var C = this;
  
        // 2. Let items be ToObject(arrayLike).
        var items = toItems(arrayLike);
  
        // 3. ReturnIfAbrupt(items).
        if (arrayLike == null) {
          throw new TypeError("Array.from requires an array-like object - not null or undefined");
        }
  
        // 4. If mapfn is undefined, then let mapping be false.
        var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
        var T;
        if (typeof mapFn !== 'undefined') {
          // 5. else      
          // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
          if (!isCallable(mapFn)) {
            throw new TypeError('Array.from: when provided, the second argument must be a function');
          }
  
          // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
          if (arguments.length > 2) {
            T = arguments[2];
          }
        }
  
        // 10. Let lenValue be Get(items, "length").
        // 11. Let len be ToLength(lenValue).
        var len = toLength(items.length);
  
        // 13. If IsConstructor(C) is true, then
        // 13. a. Let A be the result of calling the [[Construct]] internal method 
        // of C with an argument list containing the single item len.
        // 14. a. Else, Let A be ArrayCreate(len).
        var A = isCallable(C) ? Object(new C(len)) : new Array(len);
  
        // 16. Let k be 0.
        var k = 0;
        // 17. Repeat, while k < len… (also steps a - h)
        var kValue;
        while (k < len) {
          kValue = items[k];
          if (mapFn) {
            A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
          } else {
            A[k] = kValue;
          }
          k += 1;
        }
        // 18. Let putStatus be Put(A, "length", len, true).
        A.length = len;
        // 20. Return A.
        return A;
      };
    }());
}