
// {
//     "key":"PSSSW-97021",
//     "summary":"This is MR1's summary.",
//     "description":"This is MR1's description.",
//     "relatedTo":[
//         "person1",
//         "person2",
//         "person3",
//         "person4"
//     ],
//     "viewCount":100,
//     "url":"https://optics-jira.int.net.nokia.com/browse/PSSSW-97021",
//     "isCollected":true,
//     "isRecycled":false,
//     "isLocked":true,
//     "labelList":[
//         {
//             "label":"label1",
//             "score":5
//         },
//         {
//             "label":"label2",
//             "score":3
//         }
//     ]
// }
/**
 * 用于解析并实例化/api/search/接口返回的数据
 *
 * @param {*} key MR号
 * @param {*} summary 概述
 * @param {*} description MR描述
 * @param {*} relatedTo 相关联的人的头像url
 * @param {*} viewCount 统计被查看次数
 * @param {*} url 对应jira中的M地址
 * @param {*} isCollected 是否被收藏
 * @param {*} isRecycled 是否被放入回收站
 * @param {*} labelList 标签列表
 */
function MR(key,summary,description,relatedTo,viewCount,url,isCollected,isRecycled,labelList){
    this.key = key;
    this.summary = summary;
    this.description = description;
    this.relatedTo = relatedTo;
    this.viewCount = viewCount;
    this.url = url;
    this.isCollected = isCollected;
    this.isRecycled = isRecycled;
    this.labelList = labelList;
}

MR.prototype.setSummary = function (summary) {
    this.summary = summary;
}
MR.prototype.setDesc = function (description) {
    this.description = description;
}
MR.prototype.setRelatedTo = function (relatedTo) {
    //arrray
    this.relatedTo = relatedTo;
}
MR.prototype.setViewCount = function (viewCount) {
    //int
    this.viewCount = viewCount;
}
MR.prototype.setJiraUrl = function (url) {
    this.url = url;
}
MR.prototype.setIsCollected = function (isCollected) {
    this.isCollected = isCollected;
}
MR.prototype.setIsRecycled = function (isRecycled) {
    this.isRecycled = isRecycled;
}
MR.prototype.setIsLocked = function (isLocked) {
    this.isLocked = isLocked;
}
MR.prototype.setLabelList = function (){
    return this.labelList;
}
MR.prototype.getSummary = function () {
    return this.summary;
}
MR.prototype.getDesc = function () {
    return this.description;
}
MR.prototype.getRelatedTo = function () {
    //arrray
    return this.relatedTo;
}
MR.prototype.getViewCount = function () {
    //int
    return this.viewCount;
}
MR.prototype.getJiraUrl = function () {
    return this.url;
}
MR.prototype.getIsCollected = function () {
    return this.isCollected;
}
MR.prototype.getIsRecycled = function () {
    return this.isRecycled;
}
MR.prototype.getIsLocked = function () {
    return this.isLocked;
}
MR.prototype.getLabelList = function (){
    return this.labelList;
}

MR.prototype.toJson = function () {
    return {
        "key": this.key,
        "summary": this.summary,
        "description": this.description,
        "relatedTo": this.relatedTo,
        "viewCount": this.viewCount,
        "url": this.url,
        "isCollected": this.isCollected,
        "isRecycled": this.isRecycled,
        "isLocked": this.isLocked,
        "labelList": this.labelList
    }
}