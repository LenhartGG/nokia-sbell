var over = null;
var APN_VALID = false;
window.tpl = (function () {
    return function tmpl(id) {        
        return document.getElementById(id).innerHTML;
    };
})();
window.onload= function(){
    initData();
    initListener();
}
function initData(){
    initGroup0Data();
    initGroup1Data();
    initGroup2Data();
    initGroup3Data();
    initGroup4Data();
    initGroup5Data();
    initGroup7Data();
    initGroup8Data();
    getdataList();// 初始化dataList
}
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

function initListener(){
  //grid item onmouseenter and onmouseleave
  Array.from(document.getElementsByClassName('thumbnailDefault')).forEach(function(div) {
    div.onmouseenter =  function(event){
        if (!over) {
            over = window.setTimeout(function () {
                removeDiyStyle(div);
                div.getel
            }, 500);
        }
        event.stopPropagation();
    } 
    div.onmouseleave= function(event){
        if(over){
            clearTimeout(over);
            over = null;
        }
        addDiyStyle(div);
        event.stopPropagation();
    };    
    div.addEventListener('click',function (event) {
        parseModalStyleByID(div.id);        
    });
  });
  //check in confirm
  document.getElementById('checkinBtn0').addEventListener('click',checkInGeneral0);
  document.getElementById('checkinBtn1').addEventListener('click',checkInGroup1);
  document.getElementById('checkinBtn2').addEventListener('click',checkInGroup2);
  document.getElementById('checkinBtn3').addEventListener('click',checkInGroup3);
  document.getElementById('checkinBtn4').addEventListener('click',checkInGroup4);
  document.getElementById('checkinBtn5').addEventListener('click',checkInGroup5);
  document.getElementById('checkinBtn6').addEventListener('click',checkInGroup6);
  document.getElementById('checkinBtn7').addEventListener('click',checkInGroup7);
  document.getElementById('checkinBtn8').addEventListener('click',checkInGroup8);

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
function clickIndicators(event){
    var id = event.srcElement.id;
    if(id == 'general1' || id == 'general2' || id == 'general3' || id == 'general4' || id == 'general5' || id == 'general6' || id == 'general7' || id == 'general8'){
        document.getElementById('detail'+(id.substring(id.length-1))).classList.remove('active');
    }else{
        document.getElementById('general'+(id.substring(id.length-1))).classList.remove('active');
    }
}

function removeDiyStyle(div){
    var gradientItem = document.getElementById('groupName'+div.id[div.id.length-1]);
    gradientItem.classList.remove('GridItemGradient');
    gradientItem.classList.add('GridItemTitleHover');

    div.classList.remove("thumbnailDefault_border");
    div.classList.add("thumbnailHoverBorder");
    div.classList.add("GridItemGradient");

    Array.from(div.getElementsByTagName('p')).forEach(function(p) {
        p.style.color = 'white';       
    }); 

    div.getElementsByClassName('caption')[0].getElementsByTagName('img')[0].src = "images/btn_edit_selected.png";
}

function addDiyStyle(div){
    div.classList.remove("thumbnailHoverBorder");
    div.classList.remove("GridItemGradient");
    div.classList.add("thumbnailDefault_border");

    var gradientItem = document.getElementById('groupName'+div.id[div.id.length-1]);
    gradientItem.classList.add('GridItemGradient');
    gradientItem.classList.remove('GridItemTitleHover');

    Array.from(div.getElementsByTagName('p')).forEach(function(p) {
        p.style.color = '#109DDF'; 
    }); 

    div.getElementsByClassName('caption')[0].getElementsByTagName('img')[0].src = "images/btn_edit_default.png";
}


function parseModalStyleByID(id){
    
    
    switch (id) {
        case 'group0':
            initGroup0Data();
            $('#checkinModal0').modal('show')
            break;
        case 'group1':
            initGroup1Data();
            $('#checkinModal1').modal('show')
            chooseFilename();
            break;
        case 'group2':
            initGroup2Data();
            $('#checkinModal2').modal('show')
            break;
        case 'group3':
            initGroup3Data();
            $('#checkinModal3').modal('show')
            break;
        case 'group4':
            initGroup4Data();
            $('#checkinModal4').modal('show')
            break;
        case 'group5':
            initGroup5Data();
            $('#checkinModal5').modal('show')
            break;
        case 'group6':
            initGroup6Data();
            $('#checkinModal6').modal('show')
            break;
        case 'group7':
            initGroup7Data();
            $('#checkinModal7').modal('show')
            break;
        case 'group8':
            initGroup8Data();
            $('#checkinModal8').modal('show')
            break;
        
        default:
            break;
    }
    
    chooseFilename();   //选择文件时显示文件名称
}

function checkInGeneral0(){
    var group1_tab1 = "modalBody0";
    var checkinModal1 = "checkinModal0";
    var arg = {
        group1_tab1: group1_tab1,
        checkinModal1: checkinModal1
    }
    checkdata(arg)
}

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
