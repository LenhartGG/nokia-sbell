$(function(){
    var cookieJSON = getCookie('the_cookie');
    if(cookieJSON){
        window.location.href = "index.html"
    }else{
        login()
    }
})
function login(){
    $("#logIn").click(function(){
        var admin = $("#admin").val()
        var password = $("#password").val()
        var srcData = {"username": admin, "password": password}
        $.ajax({
            crossOrigin: true,
            xhrFields: {
                withCredentials: false
            },
            type: "POST",
            url: httpPath+"/api/login",
            dataType: "json",
            data: srcData,
            success: function (data, textStatus, request) {
                console.log(request)
                if(data.result === 'success'){
                    setCookie("the_cookie",JSON.stringify(srcData))
                    window.location.href = "index.html"
                }else if(data.result === 'fail'){
                    alert("Login Fail!")
                }
            },
            error:function(XMLHttpRequest, textStatus, errorThrown) {
                console.log("logIn: " + textStatus)
            },
        });
    })
}