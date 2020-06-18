## APTweb
### 项目发布
1.项目上线时需要的文件和文件夹包括 css、scripts、page1.html、page2.html；
2.需要更改 scripts 文件夹中的 page1.js 和 page2.js 里面的 httpcontent、getGlobalLogUrl、HOST_RESTFUL、test_case_results 这三个全局变量；
3.dist文件夹是整理后要放到后台的资源
测试方法：
首先css scripts放到一个文件服务器 135.252.218.139 /usr/local/webserver/nginx/html/share/static/scripts
然后将 test_case_results.html 重命名为 test_case_results_bak.html 
最后将page1.html 重命名为 test_case_results.html

### 本地开发
只需要修改根目录下的scripts文件夹中的page1.js即可在本地开发

### 测试
service address
  135.252.217.147://home/taoic/public_html/QFA/SH_TARG_SVT_PSS8_PSS16II_112SDX11_E2E_2/SH_SVT_WEEKLY_112SDX11_BATCH_2/200306023434/logs/
origin： 
  http://135.252.217.147/~taoic/QFA/SH_TARG_SVT_PSS8_PSS16II_112SDX11_E2E_2/SH_SVT_WEEKLY_112SDX11_BATCH_2/200306023434/logs/test_case_results.html

### track跟踪
对带有 FAIL 、BLOCKED 文本的链接进行跟踪
track测试

## dashedboard
分析收集到的用户数据：
通过不同的维度去查询数据，呈现出报告
创建一些用户 svt大概40个人
人的维度：一共跑了多少个case，review反馈多少个，fail了多少个
按照一个release去查询数据： 要给月万级别的数据
时间粒度：周月天 一般来说一个人一天跑34百个 一周跑3千个 一个月万个
板卡：

首先给大家show一下ailog分析的结果和页面，
然后告诉大家为什么这么分析，分析的目的是什么


左饼图 Fail log check progress
Total Run
Failed 
Checked

右边的图（列表） AI analysis result feedback
Name， Checked failed logs， feedback AI new category

下方菜单按钮
Day, Week, Release