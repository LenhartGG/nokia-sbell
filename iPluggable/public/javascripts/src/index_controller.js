var LIMIT_COUNT = 200;
var START_ID = 1;
$(document).ready(function() {
    if(navigator.userAgent.indexOf('Chrome') == -1) {
        $(".ie-tips").show();
    }else{
        $(".ie-tips").hide();
    }
    document.getElementsByClassName("ie-tips")[0].getElementsByTagName('a')[1].onclick = function(){
        $(".ie-tips").hide();
    };
    //script for smooth scrolling
    jQuery(document).ready(function ($) {
        $(".scroll ").click(function (event) {
            // 判断默认行为是否已经被禁用
            // if (!event.defaultPrevented) {
            //     event.preventDefault();
            // }
        });
    });

    $().UItoTop({
        easingType: 'easeOutQuart'
    });

    initListener();
});

function initListener(){
    document.getElementById('top_search').addEventListener('keydown',searchEnterPress);
    document.getElementById('searchSubmit').addEventListener('click',searchFilters);
}

function searchEnterPress(e){    
    var e = e || window.event; 
    if(e.keyCode == 13){ 
        searchFilters();
    }
}

function searchFilters(){
    var filter = document.getElementById('top_search').value.split();
        if(filter){
            $.ajax({
                type: "POST",
                url: "/index/fetchResult4FuzzyQuery",
                data: { 'search': filter }
            })
            .done(function (response) {
                window.localStorage.searchResult = JSON.stringify(response.value);
                location.href = 'resultSearch';
            })
            .fail(function (error) {
                alertError();
            });
        }else{
            searchAllResult(LIMIT_COUNT,1);
        }
}

function searchAllResult(limit,fromNum){
    $.ajax({
        type: "POST",
        url: "/index/fetchAllResult",
        data:{'limit':limit,'from':fromNum}
    })
    .done(function (response) {
        window.localStorage.searchResult = JSON.stringify(response.value);
        location.href = 'resultSearch';
    })
    .fail(function (error) {
        alertError();
    });
}

function alertError(){
    swal({
        type: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      })
}