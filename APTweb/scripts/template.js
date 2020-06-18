
        var request = $.ajax({
            url: "http://aptshanghai.cn.alcatel-lucent.com/~build_load/QFA/SH_TARG_SVT_BUILD_SANITY_4/SH_LOAD_SANITY_FOADM3/191010151744/logs/falcon_load_OADM_common_provision_Testcase-2/",
            method: "GET",
            // data: { id : menuId },
            dataType: "html"
        });
        
        request.done(function( msg ) {
            // $( "#log" ).html( msg );
            console.log(msg);
            
        });
        
        request.fail(function( jqXHR, textStatus ) {
            alert( "Request failed: " + textStatus );
        });