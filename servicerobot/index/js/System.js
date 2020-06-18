/**
 * createHttpPath
 */
var configPath = "System.cfg"; // 开发
var httpPath = createHttpPath();
console.log('httpPath: ', httpPath);
function createHttpPath() {
    function load(name) {
        let xhr = new XMLHttpRequest(),
            okStatus = document.location.protocol === "file:" ? 0 : 200;
        xhr.open('GET', name, false);
        xhr.overrideMimeType("json/html;charset=utf-8");//默认为utf-8
        // xhr.overrideMimeType("text/html;charset=utf-8");//默认为utf-8
        xhr.send(null);
        return xhr.status === okStatus ? xhr.response : null;
    }
    
    var text = load(configPath);
    test = JSON.stringify(text);
    // 去掉换行符↵
    text = text.replace(/[\r\n]/g, " "); 
    console.log(text);
    // 查询 [DB] [REST] [OMS] 的索引
    var index_DB = text.search(/\[DB\]/g);
    var index_REST = text.search(/\[REST\]/);
    var index_OMS = text.search(/\[OMS\]/);
    var len_DB = '[DB]'.length;
    var len_REST = '[REST]'.length;
    var len_OMS = '[OMS]'.length;
    
    // 存储 [REST]
    var restObj = {};
    var rest_str = text.substring(index_REST + len_REST, index_OMS)

    // ip
    var rest_ip = rest_str.substring(rest_str.indexOf("ip =") + "ip =".length);
    // port
    var rest_port = rest_str.substring(rest_str.indexOf("port =") + "port =".length, rest_str.indexOf("ip ="))

    return 'http://' + rest_ip.trim() + ":" + '4006';
}