
// var GlobalLogUrl = "http://aptshanghai.cn.alcatel-lucent.com/~build_load/QFA/SH_TARG_SVT_BUILD_SANITY_4/SH_SVT_SANITY_WEEKLY_BLD1_BATCH/191215103317/logs/test_case_results.html"
//在本地调试的时候使用这个调试的 GlobalLogUrl
// var GlobalLogUrl = "http://135.252.217.201/~SHShelfTest02/QFA/SH_TARG_SVT_PTP/SH_DPEL2_PTP/191213030841/logs/test_case_results.html"; // 动态columns
//发布到线上需要重新获取 GlobalLogUrl
var GlobalLogUrl = getGlobalLogUrl();
console.log(GlobalLogUrl);

/**
 * 获取原网页log汇总链接
 */
function getGlobalLogUrl(){
    var httphref = document.location.href;
    if(httphref.includes('127.0.0.1') || httphref.includes('10.243.28.45')){
        return "http://135.252.217.201/~SHShelfTest02/QFA/SH_TARG_SVT_PTP/SH_DPEL2_PTP/191213030841/logs/test_case_results.html";
    }
    if(!httphref.includes('/logs/')){
        return httphref;
    }
    httphref = httphref.substring(0, httphref.indexOf('/logs/')+6) + 'test_case_results.html';
    return httphref;
}