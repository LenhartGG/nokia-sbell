/**
 * 顶部导航登录控制功能
 */
var appId = 1;
$(function(){

    // 初始化数据
    initLoginData()

    // 2.页面顶部嵌入导航条
    insertNav()

    // 3.点击触发登录、注销
    LogInAndOut()


    return
    // 4.自动登录
    AutoLogin();
    
})
function initLoginData(){
    localStorage.setItem('appId', appId)
}

function insertNav(){
    if(!document.getElementById('template_header')){
        return;
    }
	var html = document.getElementById('template_header').innerHTML;
	var header = document.getElementById("header")
    header.innerHTML = html;
    
    changeLoginText(localStorage.username||'')
    
    // 页面导航
    if(document.getElementById('checkIn')){
        document.getElementById('checkIn').addEventListener('click',checkIn);
    }
}

function checkIn(){
    $.ajax({
        url: '/checkin',
        type: 'GET',
        // headers: {"Authorization": JSON.parse(localStorage.getItem('tokenId')).value},
        success: function (data, status) {
            if (status == 'success') {
                location.href = 'checkin';
            }
        },
        error: function (data, status) {
            if (status == 'error') {
                location.href = 'error';
            }
        }
    });
}

// 更新登录后的界面信息
function changeLoginText(username){
    if ( username ) {
        $("#login").hide();
        $("#login2").show();
        $("#login2").html(username);
    } else {
        $("#login").show();
        $("#login2").hide();
        $("#login2").html('');
    }
}

function LogInAndOut(){
    // 点击登录 跳转至登录页面
    $("#login").click(jumpToLogin);
    // 点击注销 删除本地用户信息
    $("#logout").click(Logout);
}


function AutoLogin(){
    if(sessionStorage.login_flag){
        sessionStorage.login_flag = false;
        return
    }
    var username = localStorage.username||'';
    var password = localStorage.password||'';
    if( !(username && password) ) {
        return;
    }
    CurrentUser({
        username: localStorage.username,
        password: localStorage.password
    })
}
// 当前用户信息登录校验
function CurrentUser(arg){
    var srcData = {
        username: arg.username,
        password: arg.password,
        appId   : appId
    }
    $.ajax({
        url: '/users/currentuser',
        type: 'GET',
        data: srcData,
        dataType: 'json',
        headers: {
            'tokenId': localStorage.tokenId||''
        },
        // xhrFields:{ withCredentials:true },
        success: function (data,textStatus, request) {
            console.log("/CurrentUser : ", data);
            if (data.ret_code === 1) {
                console.log("当前账户保持登录。")
                // 2.登陆/注销 后界面导航条变换
                changeLoginText(localStorage.username||'');
                return;
            }
            if (data.ret_code === 0) {
                // 1.删除本地存储的用户信息
                // 2.界面恢复到登录之前
                removeAdmin();
                changeLoginText();
                console.log("本地用户信息被删除！")
            }
        }
    })
}

// 注销
function Logout(){
    // 只要点击注销按钮就会触发系统注销
    var srcData = {
        username: localStorage.username,
        password: localStorage.password,
        appId   : appId
    }
    $.ajax({
        url: '/users/logout',
        type: 'DELETE',
        data: srcData,
        dataType: 'json',
        headers:{
            'tokenId': localStorage.tokenId || ''
        },
        // xhrFields:{withCredentials:true},
        success: function (data,textStatus, request) {
            console.log("/logout : ", data);
            // 不论是否通过jira都执行注销
            // 1.删除本地存储的用户信息
            // 2.界面恢复到登录之前
            if (data.ret_code === 1) {
                removeAdmin();
                changeLoginText();
                console.log("账户已注销。");
            }
            if (data.ret_code === 0) {
                removeAdmin();
                changeLoginText();
                console.log("账户已注销。");
            }
        }
    })
}

