/**
 * ipluggable section_login
 */
var appId       =   localStorage.appId || 1;
var $USERNAME   =   $(".section_login .username");
var $PASSWORD   =   $(".section_login .password");
var $LOGINBTN   =   $(".login");
var $LOGOUTBTN  =   $("#logout");
var _username   =   getUsername();
var _password   =   getPassword();
var $CURRENTUSER =  $("#currentUser");
$(function () {
    // 登录窗口关闭功能
    // loginClose();

    // 手动登录
    $LOGINBTN.click(function () {
        Login({
            username: getUsername(),
            password: getPassword(),
            appId: appId
        });
    });
    // 回车登录
    $PASSWORD.on('keydown', function(evt){
        if(evt.keyCode == 13) {
            Login({
                username: getUsername(),
                password: getPassword(),
                appId: appId
            });
        }
    })

    // 手动登出
    // $LOGOUTBTN.click(function () {
    //     Logout({
    //         username: _username,
    //         password: _password
    //     })
    // });

    // 保持登录
    $CURRENTUSER.click(function (){
        var username = localStorage.username || '';
        var password = localStorage.password || '';
        if( username && password ) {
            CurrentUser({
                username: username,
                password: password
            })
        } else {
            return
        }
    });
});
function getUsername(){
    return $USERNAME.val();
}
function getPassword(){
    return $PASSWORD.val();
}
function Login(arg){
    var srcData = {
        username: arg.username,
        password: arg.password,
        appId:  arg.appId
    }
    $.ajax({
        url: '/users/register',
        type: 'POST',
        data: srcData,
        dataType: 'json',
        // headers:{ 
        //     // 'tokenId':tokenId,
        //     'Content-Type': 'application/json'
        // },
        // beforeSend: function (xhr) {
        //     xhr.setRequestHeader("tokenId", tokenId);
        // },
        // xhrFields:{ withCredentials:true },
        success: function (data,textStatus, request) {
            console.log("/login : ", data);
            if (data.ret_code === 1) {
                var tokenId = data.ret_msg.session;
                storeAdmin({
                    tokenId: tokenId,
                    username: srcData.username,
                    password: srcData.password,
                    group   : data.ret_data.group,
                    fullname: data.ret_data.fullname,
                });
                jumpPage(getQueryVariable('redirect'));
            } else if(data.ret_code === 0){
                alert(data.ret_msg)
            }
        }
    });
}
function loginClose(){
    $(".section_login .close").click(hideLoginAlert)
}
function hideLoginAlert(){
    $(".section_login").hide();
}
function jumpPage(path){
    window.location.href = path;
}

// 更新登录后的界面信息
var changeLoginText = function (username){
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