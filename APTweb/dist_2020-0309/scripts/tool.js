
/**
 * 向url中传递参数
 * @param {*} key 
 * @param {*} value 
 */
function insertParam(key, value) {
    key = escape(key); value = escape(value);

    var kvp = document.location.search.substr(1).split('&');
    if (kvp == '') {
        document.location.search = '?' + key + '=' + value;
    }
    else {

        var i = kvp.length; var x; while (i--) {
            x = kvp[i].split('=');

            if (x[0] == key) {
                x[1] = value;
                kvp[i] = x.join('=');
                break;
            }
        }

        if (i < 0) { kvp[kvp.length] = [key, value].join('='); }

        //this will reload the page, it's likely better to store this until finished
        document.location.search = kvp.join('&');
    }
}

/**
 * 向link中传递参数
 * @param {*} key 
 * @param {*} value 
 */
function insertParamToLink(link ,key, value) {
    key = escape(key); value = escape(value);

    var kvp = document.location.search.substr(1).split('&');
    if (kvp == '') {
        document.location.search = '?' + key + '=' + value;
    }
    else {

        var i = kvp.length; var x; while (i--) {
            x = kvp[i].split('=');

            if (x[0] == key) {
                x[1] = value;
                kvp[i] = x.join('=');
                break;
            }
        }

        if (i < 0) { kvp[kvp.length] = [key, value].join('='); }

        //this will reload the page, it's likely better to store this until finished
        document.location.search = kvp.join('&');
    }
}

/**
 * 获取url参数对象 getQueryString
 * @param {*} url 
 */
function getQueryString(url) { 
    if(url) { 
        url=url.substr(url.indexOf("?")+1); //字符串截取，比我之前的split()方法效率高
    } 
    var result = {}, //创建一个对象，用于存name，和value
        queryString =url || location.search.substring(1), //location.search设置或返回从问号 (?) 开始的 URL（查询部分）。 
        re = /([^&=]+)=([^&]*)/g, //正则，具体不会用
        m; 
   
   while (m = re.exec(queryString)) { //exec()正则表达式的匹配，具体不会用 
        result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]); //使用 decodeURIComponent() 对编码后的 URI 进行解码
   } 
   
   return result; 
} 
// demo 
// var myParam = getQueryString("www.taobao.com?key0=a&key1=b&key2=c"); 
// alert(myParam.key1); 

// var myParam = getQueryString("./page2.html?href=http://aptshanghai.cn.alcatel-lucent.com/~build_load/QFA/SH_TARG_SVT_BUILD_SANITY_4/SH_LOAD_SANITY_FOADM3/191203103854/logs/falcon_load_OADM_common_download_Testcase-1");
// alert(myParam.href);


/**
 * 删除url中某个参
 * 会忽略 hash 值,如果需要,自行加上即可.
 * @param {*} name 
 */
function funcUrlDel(url, name){
    // var loca = window.location;
    // var baseUrl = loca.origin + loca.pathname + "?";
    // var query = loca.search.substr(1);
    var baseUrl = url.split("?")[0] + "?";
    var query = url.split("?")[1]
    if (query.indexOf(name)>-1) {
        var obj = {}
        var arr = query.split("&");
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].split("=");
            obj[arr[i][0]] = arr[i][1];
        };
        delete obj[name];
        var url = baseUrl + JSON.stringify(obj).replace(/[\"\{\}]/g,"").replace(/\:/g,"=").replace(/\,/g,"&");
        return url
    };
}
// var restUrl = funcUrlDel("www.taobao.com?key0=a&key1=b&key2=c&key2=c", "key2");
// alert(restUrl);

function DeleteParam(url, name) {
    // var i = location.href;
    var i = url;
    var reg = new RegExp("([&\?]?)" + name + "=[^&]+(&?)", "g")

    var newUrl = i.replace(reg, function (a, b, c) {
        if (c.length == 0) {
            return '';
        } else {
            return b;
        }
    });
    // location.href = newUrl;
    return newUrl;
}

//获取cookie、
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return (arr[2]);
    else
        return null;
}

//设置cookie,增加到vue实例方便全局调用
function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
};

//删除cookie
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
};