var LIMIT_COUNT = 200;
var START_ID = 1;
var searchFormDisplay = false;  //控制searchform的显示
/**
 * 导入script模板中的html代码
 */
window.tpl = (function () {
    return function tmpl(id) {        
        return document.getElementById(id).innerHTML;
    };
})();
$(document).ready(function() {
    // 获取所有filters的数据
    getFilters();
    // 获取dataList数据
    getdataList();
    

    if(window.localStorage.searchResult){
        initResultTable(JSON.parse(window.localStorage.searchResult));
    }else{
        initResultTable([]);
    }
    initListener();
    // Advanced search toggle
    var $SearchToggle = $('.search-form .search-toggle');
    // $SearchToggle.hide();
    $searchForm = $('.search-form ');
    $('.search-form .toggle-btn').on('click', function (e) {
        if($searchForm.css('display') === 'block'){
            $searchForm.css("zIndex", 9);
        }
        // 判断默认行为是否已经被禁用
        if (!event.defaultPrevented) {
            event.preventDefault();
        }
    });
    
    // searchFormDisplay = true;
    // $('input').iCheck({
    //     checkboxClass: 'icheckbox_square-yellow',
    //     radioClass: 'iradio_square-yellow',
    //     increaseArea: '20%' // optional
    // });
    $('#detailModal').on('show.bs.modal', function (e) {
        var searchForm =  document.getElementsByClassName('search-form')[0];
        searchForm.style.background = 'grey';
        searchForm.style.border = '1px solid grey';
        var searchToggle =  document.getElementsByClassName('search-toggle')[0];
        searchToggle.style.background = 'grey';
        searchToggle.style.borderTop ="1px solid grey";
        searchToggle.style.borderBottom ="1px solid grey";
        document.getElementById('keyWord').style.background = 'grey';
    })
    $('#detailModal').on('hidden.bs.modal', function (e) {
        var searchForm =  document.getElementsByClassName('search-form')[0];
        searchForm.style.background = '#fff';
        searchForm.style.border = '1px solid #EAEAEA';
        var searchToggle =  document.getElementsByClassName('search-toggle')[0];
        searchToggle.style.background = '#fff';
        searchToggle.style.borderTop ="1px solid #EAEAEA";
        searchToggle.style.borderBottom ="1px solid #EAEAEA";
        document.getElementById('keyWord').style.background = '';
      })
});
function initListener(){
    // 将选中的词添加到
    document.getElementById('searchBtn').addEventListener('click',Search); 
    
    //监听保存按钮的点击事件
    document.getElementById('checkinBtn0').addEventListener('click',checkInGeneral0);
    document.getElementById('checkinBtn1').addEventListener('click',checkInGroup1);
    document.getElementById('checkinBtn2').addEventListener('click',checkInGroup2);
    document.getElementById('checkinBtn3').addEventListener('click',checkInGroup3);
    document.getElementById('checkinBtn4').addEventListener('click',checkInGroup4);
    document.getElementById('checkinBtn5').addEventListener('click',checkInGroup5);
    document.getElementById('checkinBtn6').addEventListener('click',checkInGroup6);
    document.getElementById('checkinBtn7').addEventListener('click',checkInGroup7);
    document.getElementById('checkinBtn8').addEventListener('click',checkInGroup8);
    // 监听指示器的点击事件
    document.getElementById('general1').addEventListener('click',clickIndicators);
    document.getElementById('detail1').addEventListener('click',clickIndicators);
    document.getElementById('general2').addEventListener('click',clickIndicators);
    document.getElementById('detail2').addEventListener('click',clickIndicators);
    document.getElementById('general3').addEventListener('click',clickIndicators);
    document.getElementById('detail3').addEventListener('click',clickIndicators);
    document.getElementById('general4').addEventListener('click',clickIndicators);
    document.getElementById('detail4').addEventListener('click',clickIndicators);
    document.getElementById('general5').addEventListener('click',clickIndicators);
    document.getElementById('detail5').addEventListener('click',clickIndicators);
    document.getElementById('general6').addEventListener('click',clickIndicators);
    document.getElementById('detail6').addEventListener('click',clickIndicators);
    document.getElementById('general7').addEventListener('click',clickIndicators);
    document.getElementById('detail7').addEventListener('click',clickIndicators);
    document.getElementById('general8').addEventListener('click',clickIndicators);
    document.getElementById('detail8').addEventListener('click',clickIndicators);  
}
var filtersObj = {};

function getFilters(){
    $.ajax({
        type: "GET",
        url: "/resultSearch/fetchInitialFilters"
    })
    .done(function (response) {
        if(response.status > 0){
            initSelect('selectAPN',"APN",response.value,'APN');
            initSelect('selectModuleType',"Module Type",response.value,'TYPE');
            initSelect('selectApplication',"Application",response.value,'Application');
            initSelect('selectSubApp',"Sub-App",response.value,'SubApp');
            initSelect('selectTemperature',"Temperature",response.value,'Temperature');
            initSelect('selectTargetDistance',"Target Distance",response.value,'Targetdistance');
            initSelect('selectWaveLength',"wavelength",response.value,'Wavelength');
            initSelect('selectFiberType',"Fiber Type",response.value,'FiberConnectortype');

            
            // 多关键字选择
            filtersObj = multiSelect()
        }else{
            alertError();
        }
    })
    .fail(function (error) {
        alertError();
    });
}

//Third party functions --- start
function initSelect(selectID,placeholderStr,result,key){
    $('#'+selectID).select2({
        placeholder: placeholderStr,
        allowClear: true,
        data:result[key]        
    });
}

//Third party functions --- end
function Search(){
    // 精确查询
    searchByAdvancedFilters(getAdvancedFilters())
}

function multiSelect(){
    // var headersArr = ['selectAPN', 'selectModuleType', 'selectApplication', 'selectSubApp', 'selectTemperature', 'selectTargetDistance', 'selectWaveLength', 'selectFiberType'];
    var headersObj = {};
    var oldArr = [];
    var newArr = [];
    var removeArr = [];
    var addArr = [];
    var selectArr = $('#section_table select');
    Array.from(selectArr).forEach(function( select ) {
        var selectARR = [];
        $('#'+select.id).change(function(evt){
            var arr = []
            var data =  $(this).select2('data')
            data.forEach(function(ele){
                arr.push(ele.text)
            })
            selectARR = arr;
            headersObj[select.id] = selectARR;
            console.log(selectARR);
            console.log(headersObj);
            return headersObj;

            // 遍历对象 *已舍弃
            var newStr = newString(headersObj);
            function newString(obj){
                var newArr = [];
                for(var key in obj) {
                    newArr = newArr.concat(obj[key]);
                }
                return newArr.toString();
            }
            // console.log('multiSelect: ' + newStr);       
            $('#keyWord').val(newStr);
        });
    });
}

function fillInBlank(filters){
    var str = "";
    for(var key in filters){
        filters[key].forEach(function(item) {
            str += item + ",";
        });
    }
    str = str.substring(0, str.lastIndexOf(","));
    document.getElementById('keyWord').value = str;
}

function regularKeywords(){

}

function initResultTable(srcData){
    $("#table").bootstrapTable('destroy');
    $("#table").bootstrapTable({
        cache: false,
        striped: true,
        pageSize: 10,
        pageNumber: 1,
        pageList: [10, 20, 30, 40],
        pagination: true,
        sortOrder: "desc",
        search: true,
        showColumns: false,
        showRefresh: false,
        showToggle: false,
        minimumCountColumns: 2,
        sidePagination: "client", //服务端处理分页 
        clickToSelect: true,
        minimumCountColumns: 2, 
        uniqueId: "id",  
        Icons:'glyphicon-export',
        toolbar: '#toolbar',
        toolbarAlign:'left',
        showExport: true,  //是否显示导出按钮  
        buttonsAlign: "right",  //按钮位置 
        exportDataType:'all', 
        exportTypes:['sql','csv','excel'], 
        exportOptions: {
            // ignoreColumn: [0, 1],  //忽略某一列的索引  
            fileName: 'SearchResult',  //文件名称设置  
            worksheetName: 'sheet1',  //表格工作区名称  
            tableName: 'table',
            excelstyles: ['background-color', 'color', 'font-size', 'font-weight'],
            onMsoNumberFormat: DoOnMsoNumberFormat
        }, 
        columns: [
            {
                field: "id", title: "ID", align: "center", valign: "middle",visible:true,sortable: "true"
            },
            {
                field: "APN", title: "APN", align: "center", valign: "middle",sortable:"true"
            },  
            {
                field: "TYPE", title: "Module Type", align: "center", valign: "middle"
            },
            {
                field: "Application", title: "Application", align: "center", valign: "middle"
            },
            {
                field: "SubApp", title: "Sub-App", align: "center", valign: "middle"
            },
            {
                field: "Temperature", title: "Temperature", align: "center", valign: "middle",sortable:"true"
            },
            {
                field: "Targetdistance", title: "Target Distance", align: "center", valign: "middle", sortable: "true"
            },
            {
                field: "Wavelength", title: "Wave Length", align: "center", valign: "middle", sortable: "true"
            },
            {
                field: "FiberConnectortype", title: "Fiber Type", align: "center", valign: "middle"
            }          
        ],
        data:srcData,
        onPageChange: function(size, number){
            console.log("size : "+size+" , number : "+number);
            if(size * number == $('#table').bootstrapTable('getData') .length){
                searchAllResult(srcData.length + number,size*number+1);
            }
        },
        formatNoMatches: function(){
            return "NO DATA";
        },
        formatLoadingMessage:function(){
            return "Loading, please wait?..";
        },
        onClickRow : function(row,trElement){
            var $search_form = $("#section_table .search-form");
            $search_form.css("zIndex", 0);
            $('#detailModalTitle').html('APN : '+row.APN);
            getTablesHtmlInModal(row);
        }
    });
    changeTableStyle();
}
function DoOnMsoNumberFormat(cell, row, col) {  
    var result = "";  
    if (row > 0 && col == 0)  
        result = "\\@";  
    return result;  
} 
function changeTableStyle(){
    document.getElementById('table').getElementsByTagName('thead')[0].getElementsByTagName('tr')[0].setAttribute('class','thGradient');
}

function getTablesHtmlInModal(row){
    parseModalStyleByID(row)
    return;
}

function getDetailTableHtml(element){
    var tableHtml = 
    "<tbody>";
    for (var key in element) {
        if (element.hasOwnProperty(key)) {
            if( key == "Application" || key == "Temperature" || key == "PowerConsumption" || key == "PhysicalDimension" || key == "Acronym" || key == "CLEICode" || key == "1ABinBOM" ){                
                var value = element[key];
                var valHtml = 
                    "<tr style='border:1px solid grey'>"+
                    "<th scope='row'><b>"+key+"</b></th>"+
                    "<td colspan=5 >"+value+"</td>"+
                    "</tr>";
                tableHtml = tableHtml + valHtml;                    
            }else if(key == "Vendor1"){                    
                var valHtml = 
                    "<tr style='border:1px solid grey'>"+
                    "<th scope='row'><b>Vendor</b></th>";
                if(element.Vendor1){
                   valHtml = valHtml + "<td>"+element.Vendor1+"</td>";
                }else{
                    valHtml = valHtml + "<td>-</td>";
                }
                if(element.Vendor2){
                   valHtml = valHtml + "<td>"+element.Vendor2+"</td>";
                }else{
                    valHtml = valHtml + "<td>-</td>";
                }
                if(element.Vendor3){
                   valHtml = valHtml + "<td>"+element.Vendor3+"</td>";
                }else{
                    valHtml = valHtml + "<td>-</td>";
                }
                if(element.Vendor4){
                   valHtml = valHtml + "<td>"+element.Vendor4+"</td>";
                }else{
                    valHtml = valHtml + "<td>-</td>";
                }
                if(element.Vendor5){
                   valHtml = valHtml + "<td>"+element.Vendor5+"</td>";
                }else{
                    valHtml = valHtml + "<td>-</td>";
                }
                valHtml = valHtml + "</tr>";
                tableHtml = tableHtml + valHtml; 
            }else if(key == "Vendor1PN"){
                var valHtml = 
                "<tr style='border:1px solid grey'>"+
                    "<th scope='row'><b>Vendor PN</b></th>";
                if (element.Vendor1PN) {
                    valHtml = valHtml + "<td>" + element.Vendor1PN + "</td>";
                } else {
                    valHtml = valHtml + "<td>-</td>";
                }
                if (element.Vendor2PN) {
                    valHtml = valHtml + "<td>" + element.Vendor2PN + "</td>";
                } else {
                    valHtml = valHtml + "<td>-</td>";
                }
                if (element.Vendor3PN) {
                    valHtml = valHtml + "<td>" + element.Vendor3PN + "</td>";
                } else {
                    valHtml = valHtml + "<td>-</td>";
                }
                if (element.Vendor4PN) {
                    valHtml = valHtml + "<td>" + element.Vendor4PN + "</td>";
                } else {
                    valHtml = valHtml + "<td>-</td>";
                }
                if (element.Vendor5PN) {
                    valHtml = valHtml + "<td>" + element.Vendor5PN + "</td>";
                } else {
                    valHtml = valHtml + "<td>-</td>";
                }
                valHtml = valHtml + "</tr>";
                tableHtml = tableHtml + valHtml; 
            }            
        }
    }
    tableHtml = tableHtml + 
        "</tbody>";
    return tableHtml;
}
function getSubGroupTableHtml(element){
    switch(element.Application){
        case 'B&W':
            return getSubGroup1_TableHtml(element);
            break;
        case "CWDM":
            return getSubGroup2_TableHtml(element);
            break;
        case "DWDM":
            return getSubGroup3_TableHtml(element);
            break;
        case "BiDi":
            return getSubGroup4_TableHtml(element);
            break;
        case "100G /Single Rate":
            return getSubGroup5_TableHtml(element);
            break;
        case "100G /Dual Rate":
            return getSubGroup6_TableHtml(element);
            break;
        case "100G /Tunable":
            return getSubGroup7_TableHtml(element);
            break;
        case "40G":
            return getSubGroup8_TableHtml(element);
            break;
    }
}

function parseThHtml(element,disableKey,enableKey,thHead,thUnit){//thUnit得带()
    var row = 
    "<tr style='border:1px solid grey'>"+
    "<th>"+thHead+thUnit+")</th>";
    if(element[disableKey]){
        row = row+ "<td>"+element[disableKey]+"</td>";
    }else{
        row = row+ "<td></td>";
    }
    if(element[enableKey]){
        row = row+"<td>"+element[enableKey]+"</td>";
    }else{
        row = row+ "<td></td>";
    }
    row = row+"</tr>";
}

function getSubGroup1_TableHtml(element){
    var tableHtml = 
    "<tbody>";
    for (var key in element) {
        if (element.hasOwnProperty(key)) {
            var value = element[key];
            var valHtml =
                "<tr style='border:1px solid grey'>"
                // "<th scope='row'><b>" + key + "</b></th>";
            switch(key){
                case 'Targetdistance':
                    valHtml = valHtml + "<th scope='row'><b>" + key + " (km)</b></th>";
                    break;                
                case 'BitRate':
                    valHtml = valHtml + "<th scope='row'><b>" + key + " (Gbps)</b></th>";
                    break;
                case 'Wavelength':
                    valHtml = valHtml + "<th scope='row'><b>" + key + " (nm)</b></th>";
                    break;
                
                case 'Txpower':
                case 'Overload':
                    valHtml = valHtml + "<th scope='row'><b>" + key + " (dBm)</b></th>";
                    break;
                case 'ExtinctionRation':
                case 'Sensitivity_BacktoBack':
                case 'AttenuationRange':
                case 'PathPenalty':
                    valHtml = valHtml + "<th scope='row'><b>" + key + " (dB)</b></th>";
                    break;
                default:
                    valHtml = valHtml + "<th scope='row'><b>" + key + "</b></th>";
                    break;
            }            
            if (value) {
                valHtml = valHtml + "<td>" + value + "</td>";
            } else {
                valHtml = valHtml + "<td>-</td>";
            }
            valHtml = valHtml + "</tr>";
            tableHtml = tableHtml + valHtml;
        }
    }
    tableHtml = tableHtml + 
        "</tbody>";
    return tableHtml;
}


function getSubGroup2_TableHtml(element){
    var tableHtml = 
    "<tbody>";
    var thHtml = 
    "<tr style='border:1px solid grey'>"+
    "<th></th>"+
    "<td><b>FEC disable (1E-12)</b></td>"+
    "<td><b>FEC enable (1E-4)</b></td>"+
    "</tr>"
    // Sensitivity_FECdisable,Sensitivity_FECenable
    var sensitivityRow = 
    "<tr style='border:1px solid grey'>"+
    "<th>Sensitivity(Back to Back)(dBm)</th>"+
    "<td>"+element.Sensitivity_FECdisable+"</td>"+
    "<td>"+element.Sensitivity_FECenable+"</td>"+
    "</tr>";
    //Attenuation_range_FECdisable,Attenuation_range_FECenable
    var attenuationRangeRow = 
    "<tr style='border:1px solid grey'>"+
    "<th>Attention range(dB)</th>"+
    "<td>"+element.Attenuation_range_FECdisable+"</td>"+
    "<td>"+element.Attenuation_range_FECenable+"</td>"+
    "</tr>";
    // Maximum_chromatic_dispersion_FECdisable,Maximum_chromatic_dispersion_FECenable
    var maxChromaticRow = 
    "<tr style='border:1px solid grey'>"+
    "<th>Maximum chromatic dispersion(ps/nm)</th>"+
    "<td>"+element.Maximum_chromatic_dispersion_FECdisable+"</td>"+
    "<td>"+element.Maximum_chromatic_dispersion_FECenable+"</td>"+
    "</tr>";

    var keys = Object.keys(element);
    keys.forEach(function(key) {
            var value = element[key];
            if (key != "Sensitivity_FECdisable" && key != "Sensitivity_FECenable" &&
            key != "Attenuation_range_FECdisable" && key != "Attenuation_range_FECenable" &&
            key != "Maximum_chromatic_dispersion_FECdisable" && key != "Maximum_chromatic_dispersion_FECenable") {
                var valHtml =
                    "<tr style='border:1px solid grey'>"
                switch (key) {                   
                    case 'Targetdistance':
                        valHtml = valHtml + "<th scope='row'><b>" + key + " (km)</b></th>";
                        break;
                    case 'BitRate':
                        valHtml = valHtml + "<th scope='row'><b>" + key + " (Gbps)</b></th>";
                        break;
                    case 'Wavelength':
                        valHtml = valHtml + "<th scope='row'><b>" + key + " (nm)</b></th>";
                        break;
                    case 'Txpower':
                    case 'Overload':
                        valHtml = valHtml + "<th scope='row'><b>" + key + " (dBm)</b></th>";
                        break;
                    case 'ExtinctionRation':
                    case 'PathPenalty':
                        valHtml = valHtml + "<th scope='row'><b>" + key + " (dB)</b></th>";
                        break;
                    default:
                        valHtml = valHtml + "<th scope='row'><b>" + key + "</b></th>";
                        break;
                }
                if (value) {
                    valHtml = valHtml + "<td>" + value + "</td>";
                    valHtml = valHtml + "<td></td>";
                } else {
                    valHtml = valHtml + "<td></td>";
                    valHtml = valHtml + "<td></td>";
                }
            }
        if(keys.indexOf(key) == keys.length-1){
            valHtml = valHtml + thHtml + sensitivityRow + attenuationRangeRow + maxChromaticRow;
        }
        valHtml = valHtml + "</tr>";
        tableHtml = tableHtml + valHtml;        
    });
    tableHtml = tableHtml + 
        "</tbody>";
    return tableHtml;
}

function getSubGroup3_TableHtml(element){
    var tableHtml = 
    "<tbody>";
    var thHtml = 
    "<tr style='border:1px solid grey'>"+
    "<th></th>"+
    "<td><b>FEC disable</b></td>"+
    "<td><b>FEC enable</b></td>"+
    "</tr>"
    // BERObjective_FECdisable,BERObjective_FECenable,
    var berObjectivRow = 
    "<tr style='border:1px solid grey'>"+
    "<th>BER objective</th>"+
    "<td>"+element.BERObjective_FECdisable+"</td>"+
    "<td>"+element.BERObjective_FECenable+"</td>"+
    "</tr>";
    var sensitivityRow = 
    "<tr style='border:1px solid grey'>"+
    "<th>Sensitivity(Back to Back)(dBm)</th>"+
    "<td>"+element.Sensitivity_FECdisable+"</td>"+
    "<td>"+element.Sensitivity_FECenable+"</td>"+
    "</tr>";
    //Attenuation_range_FECdisable,Attenuation_range_FECenable
    var attenuationRangeRow = 
    "<tr style='border:1px solid grey'>"+
    "<th>Attention range(dB)</th>"+
    "<td>"+element.Attenuation_range_FECdisable+"</td>"+
    "<td>"+element.Attenuation_range_FECenable+"</td>"+
    "</tr>";
   
    //OSNRtolerance_withmaxCD_FECdisable, OSNRtolerance_withmaxCD_FECenable
    var osnRtoleranceMaxRow = 
    "<tr style='border:1px solid grey'>"+
    "<th>OSNR tolerance(with CD)(dB)</th>"+
    "<td>"+element.OSNRtolerance_withmaxCD_FECdisable+"</td>"+
    "<td>"+element.OSNRtolerance_withmaxCD_FECenable+"</td>"+
    "</tr>";
    // OSNRtolerance_withminCD_FECdisable,OSNRtolerance_withminCD_FECenable
    var osnRtoleranceMinRow =
    "<tr style='border:1px solid grey'>"+
    "<th>OSNR tolerance(min CD)(dB)</th>"+
    "<td>"+element.OSNRtolerance_withminCD_FECdisable+"</td>"+
    "<td>"+element.OSNRtolerance_withminCD_FECenable+"</td>"+
    "</tr>";

    var keys = Object.keys(element);
    keys.forEach(function(key) {
            var value = element[key];
            if (key != "BERObjective_FECdisable" && key != "BERObjective_FECenable" &&
            key != "Sensitivity_FECdisable" && key != "Sensitivity_FECenable" &&
            key != "Attenuation_range_FECdisable" && key != "Attenuation_range_FECenable" &&
            key != "OSNRtolerance_withmaxCD_FECdisable" && key != "OSNRtolerance_withmaxCD_FECenable" &&
            key != "OSNRtolerance_withminCD_FECdisable" && key != "OSNRtolerance_withminCD_FECenable") {
                var valHtml =
                    "<tr style='border:1px solid grey'>"
                switch (key) {
                    // Application,FiberConnectortype,Targetdistance,BitRate,Source_type,Wavelength  ,  Frequency,FrequencySpacing,Channels,Txpower,ExtinctionRation,Overload,PathPenalty
                    case 'Targetdistance':
                        valHtml = valHtml + "<th scope='row'><b>" + key + " (km)</b></th>";
                        break;
                    case 'BitRate':
                        valHtml = valHtml + "<th scope='row'><b>" + key + " (Gbps)</b></th>";
                        break;
                    case 'Wavelength':
                        valHtml = valHtml + "<th scope='row'><b>" + key + " (nm)</b></th>";
                        break;
                    case 'Overload':
                    case 'Txpower':
                        valHtml = valHtml + "<th scope='row'><b>" + key + " (dBm)</b></th>";
                        break;
                    case 'ExtinctionRation':
                    case 'PathPenalty':
                        valHtml = valHtml + "<th scope='row'><b>" + key + " (dB)</b></th>";
                        break;
                    case 'Frequency':
                        valHtml = valHtml + "<th scope='row'><b>" + key + " (THZ)</b></th>";
                        break;
                    case 'FrequencySpacing':
                        valHtml = valHtml + "<th scope='row'><b>" + key + " (GHZ)</b></th>";
                        break;
                    default:
                        valHtml = valHtml + "<th scope='row'><b>" + key + "</b></th>";
                        break;
                }
                if (value) {
                    valHtml = valHtml + "<td>" + value + "</td>";
                    valHtml = valHtml + "<td></td>";
                } else {
                    valHtml = valHtml + "<td></td>";
                    valHtml = valHtml + "<td></td>";
                }
            }
        if(keys.indexOf(key) == keys.length-1){
            valHtml = valHtml + thHtml + berObjectivRow + sensitivityRow + attenuationRangeRow + osnRtoleranceMaxRow + osnRtoleranceMinRow;
        }
        valHtml = valHtml + "</tr>";
        tableHtml = tableHtml + valHtml;        
    });
    tableHtml = tableHtml + 
        "</tbody>";
    return tableHtml;
}
function getSubGroup4_TableHtml(element){

}
function getSubGroup5_TableHtml(element){
    var tableHtml = 
    "<tbody>";
    for (var key in element) {
        if (element.hasOwnProperty(key)) {
            var value = element[key];
            var valHtml =
                "<tr style='border:1px solid grey'>"
            switch(key){
                case 'Targetdistance':
                    valHtml = valHtml + "<th scope='row'><b>" + key + " (km)</b></th>";
                    break;                
                case 'Wavelength_deviation':
                case 'Wavelength':
                    valHtml = valHtml + "<th scope='row'><b>" + key + " (nm)</b></th>";
                    break;
                case "Overload_per_lane":
                case "Sensitivity_per_lane_BacktoBack":
                case "Txpower_perlane":
                case 'Txpower_total':
                    valHtml = valHtml + "<th scope='row'><b>" + key + " (dBm)</b></th>";
                    break;
                case 'ExtinctionRation':
                case 'AttenuationRange':
                case 'PathPenalty':
                    valHtml = valHtml + "<th scope='row'><b>" + key + " (dB)</b></th>";
                    break;
                case 'Data_rate_per_lane':
                    valHtml = valHtml + "<th scope='row'><b>" + key + " (Gbps)</b></th>";
                    break;
                case "Maximum_chromatic_dispersion": 
                case "Minimum_chromatic_dispersion":
                    valHtml = valHtml + "<th scope='row'><b>" + key + " (Gbps)</b></th>";
                    break;                    
                default:
                    valHtml = valHtml + "<th scope='row'><b>" + key + " (ps/nm)</b></th>";
                    break;
            }            
            if (value) {
                valHtml = valHtml + "<td>" + value + "</td>";
            } else {
                valHtml = valHtml + "<td>-</td>";
            }
            valHtml = valHtml + "</tr>";
            tableHtml = tableHtml + valHtml;
        }
    }
    tableHtml = tableHtml + 
        "</tbody>";
    return tableHtml;
}
function getSubGroup6_TableHtml(element){

}
function getSubGroup7_TableHtml(element){
   
}
function getSubGroup8_TableHtml(element){

}

function searchAllResult(limit,fromNum){
    $.ajax({
        type: "POST",
        url: "/index/fetchAllResult",
        data:{'limit':limit,'from':fromNum}
    })
    .done(function (response) {
        if(response.status > 0){
            if(fromNum != START_ID){
                $('#table').bootstrapTable('append',response.value);
                window.localStorage.searchResult =JSON.stringify(JSON.parse(window.localStorage.searchResult).concat(response.value));
            }else{
                window.localStorage.searchResult =JSON.stringify(response.value);
                initResultTable(response.value);
            }
        }
    })
    .fail(function (error) {
        alertError();
    });
}
function getAdvancedFilters(){
    var filters = {};
    var selectArr = document.getElementById('section_table').getElementsByTagName('select');
    Array.from(selectArr).forEach(function(select) {
        var data = $('#'+select.id).select2('data');
        var filterArr = [];
        data.forEach(function(element) {
            filterArr.push(element.text);
        });
        if(filterArr.length > 0){
            switch(select.id){
                case 'selectAPN':
                filters.APN = filterArr;
                break;
                case 'selectApplication':
                filters.Application = filterArr;
                break;
                case 'selectModuleType':
                filters.TYPE = filterArr;
                break;
                case 'selectSubApp':
                filters.SubApp = filterArr;
                break;
                case 'selectTemperature':
                filters.Temperature = filterArr;
                break;
                case 'selectTargetDistance':
                filters.Targetdistance = filterArr;
                break;
                case 'selectWaveLength':
                filters.Wavelength = filterArr;
                break;
                case 'selectFiberType':
                filters.FiberConnectortype = filterArr;
                break;
            }
        }
    });
    return filters;
}
function searchByAdvancedFilters(filters){
    $.ajax({
        type: "POST",
        url: "/resultSearch/searchByAdvancedFilters",
        data: filters
    })
    .done(function (response) {
        if(response.status > 0 ){
            localStorage.removeItem('searchResult');
            initResultTable(response.value);
        }else{
            alertError();
        }
    })
    .fail(function (error) {
        alertError();
    });
}


function parseModalStyleByID(row){
    var type;
    if(row.Application){
        type = row.Application.trim();   //去掉字符串头尾空格
    }
    if(type === 'DWDM'){
        type = 'DWDM/Tunable';
    }
    if(type === 'Tunable'){
        type = 'DWDM/Tunable';
    }
    console.log(type)
    console.log(row)
    

    // debugger;
    switch (type) {
        case 'General':
            initGroup0Data(row);
            $('#checkinModal0').modal('show')
            fillData0(row);
            break;
        case 'B&W':
            initGroup1Data(row);
            $('#checkinModal1').modal('show')
            $('#checkinModalTitle1').html(type.toString())
            fillData1(row);
            break;
        case 'Smart':
            initGroup1Data(row);
            $('#checkinModal1').modal('show')
            $('#checkinModalTitle1').html(type.toString())
            fillData1(row);
            break;
        case 'OSC':
            initGroup1Data(row);
            $('#checkinModal1').modal('show')
            $('#checkinModalTitle1').html(type.toString())
            fillData1(row);
            break;
        case 'EL':
            initGroup1Data(row);
            $('#checkinModal1').modal('show')
            $('#checkinModalTitle1').html(type.toString())
            fillData1(row);
            break;
        case 'sVOA':
            initGroup1Data(row);
            $('#checkinModal1').modal('show')
            $('#checkinModalTitle1').html(type.toString())
            fillData1(row);
            break;
        case 'fVOA':
            initGroup1Data(row);
            $('#checkinModal1').modal('show')
            $('#checkinModalTitle1').html(type.toString())
            fillData1(row);
            break;
        case '3G':
            initGroup1Data(row);
            $('#checkinModal1').modal('show')
            $('#checkinModalTitle1').html(type.toString())
            fillData1(row);
            break;
        case 'CWDM':
            initGroup2Data(row);
            $('#checkinModal2').modal('show');
            $('#checkinModalTitle2').html(type.toString())
            fillData2(row);
            break;
        case 'DWDM/Tunable':
            initGroup3Data(row);
            $('#checkinModal3').modal('show')
            $('#checkinModalTitle3').html(type.toString())
            fillData3(row);
            break;
        case 'BiDi':
            initGroup4Data(row);
            $('#checkinModal4').modal('show')
            $('#checkinModalTitle4').html(type.toString())
            fillData4(row);
            break;
        case '100G /Single Rate':
            initGroup5Data(row);
            $('#checkinModal5').modal('show')
            $('#checkinModalTitle5').html(type.toString())
            fillData5(row);
            break;
        case '4x25G /Single Rate':
            initGroup5Data(row);
            $('#checkinModal5').modal('show')
            $('#checkinModalTitle5').html(type.toString())
            fillData5(row);
            break;
        case '10x10G /Single Rate':
            initGroup5Data(row);
            $('#checkinModal5').modal('show')
            $('#checkinModalTitle5').html(type.toString())
            fillData5(row);
            break;
        case '100G /Dual Rate':
            initGroup6Data(row);
            $('#checkinModal6').modal('show')
            $('#checkinModalTitle6').html(type.toString())
            fillData6(row);
            break;
        case '4x25G /Dual Rate':
            initGroup6Data(row);
            $('#checkinModal6').modal('show')
            $('#checkinModalTitle6').html(type.toString())
            fillData6(row);
            break;
        case '10x10G /Dual Rate':
            initGroup6Data(row);
            $('#checkinModal6').modal('show')
            $('#checkinModalTitle6').html(type.toString())
            fillData6(row);
            break;
        case '100G /Tunable':
            initGroup7Data(row);
            $('#checkinModal7').modal('show')
            $('#checkinModalTitle7').html(type.toString())
            fillData7(row);
            break;
        case '4x28G /Tunable':
            initGroup7Data(row);
            $('#checkinModal7').modal('show')
            $('#checkinModalTitle7').html(type.toString())
            fillData7(row);
            break;
        case '40G':
            initGroup8Data(row);
            $('#checkinModal8').modal('show')
            $('#checkinModalTitle8').html(type.toString())
            fillData8(row);
            break;
        
        default:
            initGroup0Data(row);
            $('#checkinModal0').modal('show')
            fillData0(row);
            break;
    }
    
    chooseFilename();   //选择文件时显示文件名称
}
/**
 * 根据Application属性值得不同将提供不同的弹出框内嵌模板
 * 目前只写了9种 （0-8） 待完善
 */
function initGroup0Data(){
    $('#modalBody0').html(tpl('generalTemplate'));
}
function initGroup1Data(){
    $('#group1_tab1').html(tpl('generalTemplate'));
    $('#group1_tab2').html(tpl('group1Template'));
}
function initGroup2Data(){
    $('#group2_tab1').html(tpl('generalTemplate'));
    $('#group2_tab2').html(tpl('group2Template'));
}
function initGroup3Data(){
    $('#group3_tab1').html(tpl('generalTemplate'));
    $('#group3_tab2').html(tpl('group3Template'));
}
function initGroup4Data(){
    $('#group4_tab1').html(tpl('generalTemplate'));
    $('#group4_tab2').html(tpl('group4Template'));
}
function initGroup5Data(){
    $('#group5_tab1').html(tpl('generalTemplate'));
    $('#group5_tab2').html(tpl('group5Template'));
}
function initGroup6Data(){
    $('#group6_tab1').html(tpl('generalTemplate'));
    $('#group6_tab2').html(tpl('group6Template'));
}
function initGroup7Data(){
    $('#group7_tab1').html(tpl('generalTemplate'));
    $('#group7_tab2').html(tpl('group7Template'));
}
function initGroup8Data(){
    $('#group8_tab1').html(tpl('generalTemplate'));
    $('#group8_tab2').html(tpl('group8Template'));
}
// 将表格当前行（row）的数据分配给不同的弹出层
function fillData0(row){
    setDetailInfo('modalBody0', row);
    // setDetailInfo('group1_tab1', row);
}
function fillData1(row){
    setDetailInfo('group1_tab1', row);
    setDetailInfo('group1_tab2', row);
}
function fillData2(row){
    setDetailInfo('group2_tab1', row);
    setDetailInfo('group2_tab2', row);
}
function fillData3(row){
    setDetailInfo('group3_tab1', row);
    setDetailInfo('group3_tab2', row);
}
function fillData4(row){
    setDetailInfo('group4_tab1', row);
    setDetailInfo('group4_tab2', row);
}
function fillData5(row){
    setDetailInfo('group5_tab1', row);
    setDetailInfo('group5_tab2', row);
}
function fillData6(row){
    setDetailInfo('group6_tab1', row);
    setDetailInfo('group6_tab2', row);
}
function fillData7(row){
    setDetailInfo('group7_tab1', row);
    setDetailInfo('group7_tab2', row);
}
function fillData8(row){
    setDetailInfo('group8_tab1', row);
}

// 点击切换指示器
function clickIndicators(event){
    var id = event.srcElement.id;
    if(id == 'general1' || id == 'general2' || id == 'general3' || id == 'general4' || id == 'general5' || id == 'general6' || id == 'general7' || id == 'general8'){
        document.getElementById('detail'+(id.substring(id.length-1))).classList.remove('active');
    }else{
        document.getElementById('general'+(id.substring(id.length-1))).classList.remove('active');
    }
}

/*********************** 保存数据功能 start **********************/
function checkInGeneral0(){
    
    var group1_tab1 = "modalBody0";
    var arg = {
        group1_tab1: group1_tab1,
    }
    checkdata(arg)
}
// B&W
function checkInGroup1(){
    var group1_tab1 = "group1_tab1";
    var group1_tab2 = "group1_tab2";
    var linkFormSubmitBtn1 = "linkFormSubmitBtn1";
    var checkinModal1 = "checkinModal1";
    var arg = {
        group1_tab1: group1_tab1,
        group1_tab2: group1_tab2,
        linkFormSubmitBtn1: linkFormSubmitBtn1,
        checkinModal1: checkinModal1
    }
    checkdata(arg)

}
// CWDM
function checkInGroup2(){
    var group1_tab1 = "group2_tab1";
    var group1_tab2 = "group2_tab2";
    var linkFormSubmitBtn1 = "linkFormSubmitBtn2";
    var checkinModal1 = "checkinModal2";
    var arg = {
        group1_tab1: group1_tab1,
        group1_tab2: group1_tab2,
        linkFormSubmitBtn1: linkFormSubmitBtn1,
        checkinModal1: checkinModal1
    }
    checkdata(arg)
}
// DWDM/Tunable
function checkInGroup3(){
    var group1_tab1 = "group3_tab1";
    var group1_tab2 = "group3_tab2";
    var linkFormSubmitBtn1 = "linkFormSubmitBtn3";
    var checkinModal1 = "checkinModal3";
    var arg = {
        group1_tab1: group1_tab1,
        group1_tab2: group1_tab2,
        linkFormSubmitBtn1: linkFormSubmitBtn1,
        checkinModal1: checkinModal1
    }
    checkdata(arg)
}
// BiDi
function checkInGroup4(){
    var group1_tab1 = "group4_tab1";
    var group1_tab2 = "group4_tab2";
    var linkFormSubmitBtn1 = "linkFormSubmitBtn4";
    var checkinModal1 = "checkinModal4";
    var arg = {
        group1_tab1: group1_tab1,
        group1_tab2: group1_tab2,
        linkFormSubmitBtn1: linkFormSubmitBtn1,
        checkinModal1: checkinModal1
    }
    checkdata(arg)
}
// 100G Single Rate
function checkInGroup5(){
    var group1_tab1 = "group5_tab1";
    var group1_tab2 = "group5_tab2";
    var linkFormSubmitBtn1 = "linkFormSubmitBtn5";
    var checkinModal1 = "checkinModal5";
    var arg = {
        group1_tab1: group1_tab1,
        group1_tab2: group1_tab2,
        linkFormSubmitBtn1: linkFormSubmitBtn1,
        checkinModal1: checkinModal1
    }
    checkdata(arg)
}
// 100G Dual Rate
function checkInGroup6(){
    var group1_tab1 = "group6_tab1";
    var group1_tab2 = "group6_tab2";
    var linkFormSubmitBtn1 = "linkFormSubmitBtn6";
    var checkinModal1 = "checkinModal6";
    var arg = {
        group1_tab1: group1_tab1,
        group1_tab2: group1_tab2,
        linkFormSubmitBtn1: linkFormSubmitBtn1,
        checkinModal1: checkinModal1
    }
    checkdata(arg)
}
// 100G Tunable
function checkInGroup7(){
    var group1_tab1 = "group7_tab1";
    var group1_tab2 = "group7_tab2";
    var linkFormSubmitBtn1 = "linkFormSubmitBtn7";
    var checkinModal1 = "checkinModal7";
    var arg = {
        group1_tab1: group1_tab1,
        group1_tab2: group1_tab2,
        linkFormSubmitBtn1: linkFormSubmitBtn1,
        checkinModal1: checkinModal1
    }
    checkdata(arg)
}
// 40G
function checkInGroup8(){
    var group1_tab1 = "group8_tab1";
    var group1_tab2 = "group8_tab2";
    var linkFormSubmitBtn1 = "linkFormSubmitBtn8";
    var checkinModal1 = "checkinModal8";
    var arg = {
        group1_tab1: group1_tab1,
        group1_tab2: group1_tab2,
        linkFormSubmitBtn1: linkFormSubmitBtn1,
        checkinModal1: checkinModal1
    }
    checkdata(arg)
}
