var getServiceList = function (_GOLBAL, callback){
    var Authtoken = window.localStorage.getItem('Authtoken')
    var servicelist = '';
    $.ajax({
        crossOrigin: true,
        xhrFields: {
            withCredentials: false,
        },
        type: "GET",
        url: httpPath+"/api/omsdataintf/servicelist?date=" + pickerDate,
        dataType: "json",
        async: true,
        success: function (data, textStatus, request) {
            if (data.length != 0) {
                var servicelist = data;
                console.log(pickerDate)
                callback(servicelist, _GOLBAL)
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            /*错误信息处理*/
            console.log('getServiceList：' + textStatus);
        }
    })
}