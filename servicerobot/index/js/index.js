// 初始化
var pickerDate = format(new Date(), 'yyyy-MM-dd');  //时间选择器
var screen_flag = true;                             //全屏flag
var G_optical_order = 'AZ';                         //全局光功率顺序
$(function () {
    if(!getCookie('the_cookie')){
        window.location.href = "login.html";
        return false;
    }
    var _GOLBAL = {
        type: 'az',
        chart_ops:{
            AZRx: null,
            AZTx: null,
            ZARx: null,
            ZATx: null,
            myChart: null,
        }
    }
    // 侧边栏切换
    menuToggle()
    loadLanuageProperties(localStorage.getItem('language'));
    // 初始化时间选择器
    init(timer, _GOLBAL)
    OpticalAZZA(_GOLBAL)
    
    languageShift()
    // 中转站测试
    // Testing_transferStation()
    
    setTimeRange()
    
})

function setTimeRange(){
    var starttime = format(new Date(), 'yyyy-MM-dd');
    var endtime = format(new Date(), 'yyyy-MM-dd');
    // 时间组件
    $('#single_cal5').daterangepicker({
        singleDatePicker: true,
        singleClasses: "picker_5"
      }, function(start, end, label) {
        // console.log(start.toISOString(), end.toISOString(), label);
        starttime = format(end, 'yyyy-MM-dd');
        
      });
      $('#single_cal6').daterangepicker({
        singleDatePicker: true,
        singleClasses: "picker_6"
      }, function(start, end, label) {
        // console.log(start.toISOString(), end.toISOString(), label);
        endtime = format(end, 'yyyy-MM-dd');
      });
    $('#tabletime').click(function(){
        console.log(starttime);
        console.log(endtime);
        getTableData({
            starttime: starttime,
            endtime: endtime
        })
    })
    // 获取表格数据
}

/**
 * toggle small or large menu
 */
function menuToggle() {
    var $navbar = $(".navbar");
    var $site_title = $navbar.find('a')
    var _count = 0;
    $('#menu_toggle').on('click', function(){
        console.log(
            $site_title.find('div'));
        
        if ($BODY.hasClass('nav-md')) {
            _count++;
            console.log(_count);
            // $site_title.find('div').removeClass('nokia-logo').addClass('logo_s')
            // $('.serviceRobot-logo').removeClass('logo_l')
        } else {
            _count--;
            console.log(_count);
            // $site_title.find('div').removeClass('logo_s').addClass('nokia-logo')
            // $('.serviceRobot-logo').addClass('logo_l')
        }
    });

}

/**
 * 切换按钮 AZ ZA
 * @param {*} _GOLBAL 
 */
function OpticalAZZA(_GOLBAL) {
    $("#switch-optical button").on('click', function(){
        $(this).addClass('btn-primary').siblings().removeClass('btn-primary')
        _GOLBAL.type = $(this).attr("data-azza")
        console.log(_GOLBAL.type)
        console.log(_GOLBAL.chart_ops.myChart);
        
        if(_GOLBAL.chart_ops.myChart){
            // 1.光功率统计图
            var option = option_lineChar();
            if(_GOLBAL.type == 'az'){
                option.series[0].data = _GOLBAL.chart_ops.AZRx;
                option.series[1].data = _GOLBAL.chart_ops.AZTx;
            }
            if(_GOLBAL.type == 'za'){
                option.series[0].data = _GOLBAL.chart_ops.ZARx;
                option.series[1].data = _GOLBAL.chart_ops.ZATx;
            }
            option.xAxis[0].data = _GOLBAL.chart_ops.xAxis;
            ; if (option && typeof option === "object") {
                _GOLBAL.chart_ops.myChart.setOption(option, true);
            }
            // 2.光功率统计历史
            
        } else {
            return;
        }
    })
}
function SwitchScreen() {
    if (screen_flag) {
        screen_flag = false
        fullScreen()
    } else {
        screen_flag = true
        exitFullScreen()
    }
}
var timer = {
    // 初始化时间和servicelist
    init_time: function (_GOLBAL) {
        var curtime = new Date()
        pickerDate = format(curtime, 'yyyy-MM-dd')
        console.log('curtime: ', curtime)

        getServiceList(_GOLBAL, setServiceList)
    },
    // 手动选择时间
    pick_time: function (_GOLBAL) {
        $('#single_cal3').daterangepicker({
            format: 'yyyy-MM-dd',
            singleDatePicker: true,
            singleClasses: "picker_3"
        }, function (start, end, label) {
            pickerDate = format(start._d, 'yyyy-MM-dd');
            console.log(pickerDate);

            getServiceList(_GOLBAL, setServiceList)
        });
    }
}
function init(method, _GOLBAL) {
    if (method.init_time instanceof Function) {
        method.init_time(_GOLBAL)
    }
    if (method.pick_time instanceof Function) {
        method.pick_time(_GOLBAL)
    }
}

var serviceId, serviceTxt;  //保存业务列表id和txt
var getServiceId = function(){
    return serviceId;
}
var setServiceId = function(value){
    serviceId = value;
}
var getServiceTxt = function(){
    return serviceTxt;
}
var setServiceTxt = function(value){
    serviceTxt = value;
}
/**
 * 向业务列表添加数据
 */
function setServiceList(servicelist, _GOLBAL) {
    var SERVICELIST = $("#servicelist")
    if (SERVICELIST.children) {
        SERVICELIST.empty()
    }
    // var listgroupitems = '<li class="list-group-item" data-serlist="+k+">' +servicelist[i] + '</li>'
    var str = "";
    for (var k in servicelist) {
        str = str + '<a class="list-group-item" data-serlist="' + k + '">' + servicelist[k] + '</a>'
    }
    $("#servicelist").append(str);
    console.log('init_servicelist');
    // Add click event
    $("#servicelist .list-group-item").click(function () {
        $(this).addClass('active').siblings().removeClass('active')
        serviceId = $(this).attr('data-serlist');
        serviceTxt = $(this).text();
        setServiceId(serviceId);
        setServiceTxt(serviceTxt)
        console.log('当前点击的 serviceId: ' + serviceId)
        console.log('当前点击的 serviceTxt: ' + serviceTxt)
        console.log('pickerDate: ', pickerDate)
        /**
         * 点击业务列表后获取 1.电路图、2.光功率统计图数据、3.光功率列表数据、4.表格数据
         */
        // 1.电路图
        getNetworkDiagram(serviceId, serviceTxt)
        // 2.光功率统计图
        OpticalPowerStatistics(serviceId, _GOLBAL)
        // 3.获取光功率列表数据
        getXMLPortList(serviceId)
        
    })
}
// 电路图数据
var opticalData = null;
function getOpticalData(){
    return opticalData;
}
function setOpticalData(data){
    opticalData = data;
}
// isfirstNetworkDiagram
var isfirstNetworkDiagram = true;   //是否是第一张电路图
/**
 * 电路图
 */
function getNetworkDiagram(serviceId, serviceTxt) {
    // 如果不是第一张电路图，就清除 graph
    if(!isfirstNetworkDiagram){
        getGraph().clear()
        isfirstNetworkDiagram = false
    }

    setNetworkLoading()             //设置电路图loading
    hideNetworkTop()                //隐藏电路图 头部
    setNetworkTitle(serviceTxt)     //设置电路图title
    hideServiceTooltip()            //hide service tooltip
    
    var url = httpPath+'/api/omsdataintf/diagram/data?pathID=' + serviceId
    $.ajax({
        crossOrigin: true,
        xhrFields: {
            withCredentials: false,
        },
        type: "GET",
        url: url,
        dataType: "json",
        async: true,
        success: function (data, textStatus, request) {
            if (data.length != 0) {

                if(data.data.length == 0){
                    showServiceTooltip();
                    removeNetworkLoading() //remove loading
                    return;
                }
                hideServiceTooltip();   //hide service tooltip
                showNetworkTop()        //show newtwork top
                removeNetworkLoading()  //remove loading

                // 电路图数据
                setOpticalData(data);
                // 电路图
                E2ERoutingDisplay()     //有待封装成一个匿名函数
                
            }
        },
        error: function () {
            console.log('电路图 init_networkDiagram：请求出错');
        }
    })
}
// 设置电路图 loading
function setNetworkLoading(){
    $("#paper").busyLoad("show", {
        background: "rgba(0, 51, 101, 0.83)",
        spinner: "circles",
        animate: "slide" 
    });
}
function removeNetworkLoading(){
    $("#paper").busyLoad("hide", {
        animate: "fade"
    })
}
// 展示电路图 头部 title/tool
function showNetworkTop(){
    $("#paperbox .top").show();
}
function hideNetworkTop(){
    $("#paperbox .top").hide();
}
function setNetworkTitle(serviceTxt){
    $("#paperbox .top .title").text(serviceTxt);
}
// 点击业务在电路图中进行提示
function showServiceTooltip(){
    $("#paperbox .paper_pre").show();
    // $("#paperbox .paper_pre .paper_pre_content").text('当前业务没有数据。');
    $("#paperbox .paper_pre .paper_pre_content").attr('i18n_ServiceError');
}
function hideServiceTooltip(){
    $("#paperbox .paper_pre .paper_pre_content").text();
    $("#paperbox .paper_pre").hide();
}
function showLoadingTxt(){
    $("#paperbox .paper_pre").show();
    $("#paperbox .paper_pre .paper_pre_content").text('Loading...')
}

/**
 * 光功率统计图
 */
function OpticalPowerStatistics(serviceId, _GOLBAL) {
    _GOLBAL.myChart = echarts.init(document.getElementById("opticsPower"));
    var option = option_lineChar();

    var url = httpPath+'/api/omsdataintf/op/ports?pathID=' + serviceId
    $.ajax({
        crossOrigin: true,
        xhrFields: {
            withCredentials: false,
        },
        type: "GET",
        url: url,
        dataType: "json",
        async: true,
        success: function (data, textStatus, request) {
            if (data.length != 0) {
                console.log("光功率统计图: ", data);
                var data_AZRx = [];
                var data_AZTx = [];
                var data_ZARx = [];
                var data_ZATx = [];
                var data_xAxis = [];
                for (k in data) {
                    if (!data[k]["AZRx"] && !data[k]["AZTx"]) {
                        continue
                    }
                    data_xAxis.push(k)
                    data_AZRx.push(data[k]["AZRx"] || null);
                    data_AZTx.push(data[k]["AZTx"] || null);
                    data_ZARx.push(data[k]["ZARx"] || null);
                    data_ZATx.push(data[k]["ZATx"] || null);

                }
                option.xAxis[0].data = data_xAxis
                if(_GOLBAL.type == 'az'){
                    option.series[0].data = data_AZRx;
                    option.series[1].data = data_AZTx;
                }
                if(_GOLBAL.type == 'za'){
                    option.series[0].data = data_ZARx;
                    option.series[1].data = data_ZATx;
                }
                ; if (option && typeof option === "object") {
                    _GOLBAL.myChart.setOption(option, true);
                }
                _GOLBAL.chart_ops.AZRx = data_AZRx;
                _GOLBAL.chart_ops.AZTx = data_AZTx;
                _GOLBAL.chart_ops.ZARx = data_ZARx;
                _GOLBAL.chart_ops.ZATx = data_ZATx;
                _GOLBAL.chart_ops.xAxis = data_xAxis;
                console.log(_GOLBAL)
            }
        },
        error: function () {
            console.log('光功率统计图：请求出错');
        }
    })

    // setData_Statistics()

    function setData_Statistics() {

        var data = {
            "port1": {
                "Rx": 1.0,
                "Tx": 2.0
            }
        }
        var createDate = function () {
            var port = 'port'
            var data = {};
            for (var i = 1; i < 100; i++) {
                data[port + i] = { "Rx": random(), "Tx": random() }
            }
            return data;
        }
        console.log(createDate());
        createDate = createDate()
        console.log(option);

        for (k in createDate) {
            // console.log(createDate[k]["Rx"]);
            option.xAxis[0].data.push(k)
            option.series[0].data.push(createDate[k]["Rx"])
            option.series[1].data.push(createDate[k]["Tx"])

        }

        console.log(option);

        function random(number) {
            return parseInt(Math.random() * (number ? number : 100))
        }

    }
}
/**
 * 获取端口列表数据
 */
function getXMLPortList(serviceId){
    
    var url = httpPath+'/api/omsdataintf/service/ports?pathID=' + serviceId
    $.ajax({
        crossOrigin: true,
        xhrFields: {
            withCredentials: false,
        },
        type: "GET",
        url: url,
        dataType: "json",
        async: true,
        success: function (data, textStatus, request) {
            if (data.length != 0) {
                // console.log("端口列表----getXMLPortList: ", data);
                var portlist = data;
                setXMLPortList(portlist,serviceId)
            }
        },
        error: function () {
            console.log('getXMLPortList：端口列表请求出错');
        }
    })
}
/**
 * 向端口列表添加数据
 */
function setXMLPortList(portlist, serviceId){
    var $PORTLIST = $("#portlist")
    if ($PORTLIST.children) {
        $PORTLIST.empty()
    }
    // var listgroupitems = '<li class="list-group-item" data-serlist="+k+">' +servicelist[i] + '</li>'
    var str = "";
    for (var k in portlist) {
        str = str + '<a class="list-group-item" data-neName="' + portlist[k].neName + '" data-portName="' + portlist[k].portName + '" >' + portlist[k].neName +'/'+ portlist[k].portName + '</a>'
    }
    $("#portlist").append(str);
    
    // Add click event
    $("#portlist .list-group-item").click(function () {
        $(this).addClass('active').siblings().removeClass('active')
        var port_arr = {}
            port_arr.neName = $(this).attr('data-neName');
            port_arr.portName = $(this).attr('data-portName');
            port_arr.pathID = serviceId;
        console.log("当前点击的port: ", port_arr)
        OpticalPowerHistory(port_arr)    // 光功率统计历史
        
    })
}
/**
 * 光功率统计历史
 */
function OpticalPowerHistory(port_arr) {
    
    var dom = document.getElementById("opticsPower_history");
    var myChart = echarts.init(dom);
    var option = option_history();
    // return
    var url = httpPath+'/api/omsdataintf/port/timeline'
    $.ajax({
        crossOrigin: true,
        xhrFields: {
            withCredentials: false,
        },
        type: "POST",
        url: url,
        dataType: "json",
        data: {neName: port_arr.neName, portName: port_arr.portName, pathID: port_arr.pathID},
        async: true,
        success: function (data, textStatus, request) {
            if (data.length != 0) {
                console.log("光功率统计历史: ", data);
                // return
                for (k in data) {
                    // console.log(createDate[k]["Rx"]);
                    // if (!data[k]["AZRx"] && !data[k]["AZTx"]) {
                    //     continue
                    // }
                    option.xAxis.data.push(data[k]["timeStamp"])
                    option.series[0].data.push(data[k]["AZRx"] || null)
                    option.series[1].data.push(data[k]["AZTx"] || null)
                    
                    // option.series[0].data.push(data[k]["ZARx"] || null)
                    // option.series[1].data.push(data[k]["ZATx"] || null)
                }
                ; if (option && typeof option === "object") {
                    myChart.setOption(option, true);
                }
            }
        },
        error: function () {
            console.log('光功率统计历史 ：请求出错');
        }
    })
}

/**
 * 光功率数据表（获取数据）
 */
var table_flag = true;
function getTableData(arg){
    
    $.ajax({
        crossOrigin: true,
        xhrFields: {
            withCredentials: false,
        },
        type: "POST",
        url: httpPath+"/api/omsdataintf/port/record",
        data: {
            startDate: arg.starttime,
            endDate: arg.endtime,
        },
        dataType: "json",
        async: true,
        success: function (data, textStatus, request) {
            if (data.length != 0) {
                console.log('获取光功率表格数据：',data)
                init_DataTables(data)
            }
        },
        error: function () {
            console.log('getTableData：请求出错');
        }
    })
}
function createEmployee(obj){
    var newArray = [];
    Object.keys(obj).forEach(function (key) {
        
        newArray.push({
            "Port": obj[key].portName,
            "NE": obj[key].neName,
            "Receive（AZ）": obj[key].AZRx,
            "Transmit（AZ）": obj[key].AZTx,
            "Receive（ZA）": obj[key].ZARx,
            "Transmit（ZA）": obj[key].ZATx,
            "TimeStamp": obj[key].timeStamp,
        })
    });
    console.log(newArray);
    
    return newArray;
}
/**
 * 光功率表格
 */
var myTable;
function init_DataTables(data) {
    // var table = '<table id="datatable-buttons" class="table table-striped table-bordered"></table>'
    // $('#myTable').html()
    console.log('run_datatables');
    if(myTable){
        myTable.destroy()
    }
    if( typeof ($.fn.DataTable) === 'undefined'){ return; }
    console.log('init_DataTables');
    $("#datatable-buttons").html(getDateTable(data))
    var handleDataTableButtons = function() {
      if ($("#datatable-buttons").length) {
        myTable = $("#datatable-buttons").DataTable({
          dom: "Blfrtip",
          buttons: [
            {
              extend: "copy",
              className: "btn-sm"
            },
            {
              extend: "csv",
              className: "btn-sm"
            },
            {
              extend: "excel",
              className: "btn-sm"
            },
            {
              extend: "pdfHtml5",
              className: "btn-sm"
            },
            {
              extend: "print",
              className: "btn-sm"
            },
          ],
          responsive: true
        });
      }
    };

    TableManageButtons = function() {
      "use strict";
      return {
        init: function() {
          handleDataTableButtons();
        }
      };
    }();

    $('#datatable').dataTable();

    $('#datatable-keytable').DataTable({
      keys: true
    });

    $('#datatable-responsive').DataTable();

    $('#datatable-scroller').DataTable({
      ajax: "js/datatables/json/scroller-demo.json",
      deferRender: true,
      scrollY: 380,
      scrollCollapse: true,
      scroller: true
    });

    $('#datatable-fixed-header').DataTable({
      fixedHeader: true
    });

    var $datatable = $('#datatable-checkbox');

    $datatable.dataTable({
      'order': [[ 1, 'asc' ]],
      'columnDefs': [
        { orderable: false, targets: [0] }
      ]
    });
    $datatable.on('draw.dt', function() {
      $('checkbox input').iCheck({
        checkboxClass: 'icheckbox_flat-green'
      });
    });

    TableManageButtons.init();
    
};

function getDateTable(data) {
    var template = ""
    var tbody = ""
    var str = ""
    var AZRx,AZTx,ZARx,ZATx
    for(var k in data){
        // if(!data[k].AZRx){
        //     AZRx = "N/A"
        // }
        // if(!data[k].AZTx){
        //     AZTx = "N/A"
        // }
        // if(!data[k].ZARx){
        //     ZARx = "N/A"
        // }
        // if(!data[k].ZATx){
        //     ZATx = "N/A"
        // }

        str += 
        "  <tr>" +
        "    <td>" + data[k].portName + "</td>" +
        "    <td>" + data[k].neName + "</td>" +
        "    <td>" + data[k].AZRx + "</td>" +
        "    <td>" + data[k].AZTx + "</td>" +
        "    <td>" + data[k].ZARx + "</td>" +
        "    <td>" + data[k].ZATx + "</td>" +
        "    <td>" + data[k].timeStamp + "</td>" +
        "  </tr>"
    }
    tbody = "<tbody>" + str + "</tbody>"
    template = "<thead>" +
        "    <tr>" +
        "    <th>Port</th>" +
        "    <th>NE</th>" +
        "    <th>Receive（AZ）</th>" +
        "    <th>Transmit（AZ）</th>" +
        "    <th>Receive（ZA）</th>" +
        "    <th>Transmit（ZA）</th>" +
        "    <th>TimeStamp</th>" +
        "    </tr>" +
        "</thead>" + tbody
    return template
}

function languageShift() {
    $("#languagelist li").click(function (ev) {
        var self = $(this);
        var txt = self.children().attr('data-language');
        console.log(txt);
        localStorage.setItem('language', txt);
        loadLanuageProperties(txt);
    })
}

function loadLanuageProperties(language) {
    var defaultLan = function (){
        var navLanguage;
        if (navigator.language) {
            navLanguage = navigator.language;
        }
        else {
            navLanguage = navigator.browserLanguage;
        }
        if(navLanguage == 'zh-CN'){
            return 'zh'
        } else {
            return 'en';
        }
    }
    $.i18n.properties({
        name:'strings',    //属性文件名     命名格式： 文件名_国家代号.properties  
        // path:'${pageContext.request.contextPath}/i18n/',   //注意这里路径是你属性文件的所在文件夹  
        // path: '/servicerobot/index/languagePackage/i18n/',
        path: '/index/languagePackage/i18n/',
        mode:'map',    
        cache:true,
        language: language || defaultLan(),//zh en zh表示中文 en表示英文
        callback:function(){    
            $("[data-locale]").each(function(){    
                $(this).html($.i18n.prop($(this).data("locale")));    
            });    
       }    
   });    
}


// 测试中转站
function Testing_transferStation() {
    var test
    $('#search').change(function (e) {
        // test = $(this).html()
        console.log($(e.target))
        test = $(e.target).val();

        var frame = document.getElementById('iframe');
        console.log(frame.contentWindow);
        frame.contentWindow.postMessage(test, "*");
    })
}