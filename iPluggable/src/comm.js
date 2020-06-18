//初始化设置
var initSet = function(req, res){
    //设置全局访问
    res.setHeader('Access-Control-Allow-Origin', '*');
    //告诉客户端可以在HTTP请求中带上Cookie
    res.setHeader('Access-Control-Allow-Credentials', true);
    //告诉客户端可以接受请求的方式
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');

    return res;
}
module.exports = {
    initSet : initSet,   
};