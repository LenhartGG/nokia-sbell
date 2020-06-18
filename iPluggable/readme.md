## client

web前端 /public

- users_controller.js
  - 只在登录模块生效
  - 登录功能与项目是分离的两个部分
  - todos：后面需要做静态资源存储位置的重新调整，将登录分离出来
- nav_controller.js
  - 头部导航栏功能显示
- utils.js
  - javascript工具箱
  - 获取url参数
  - 创建下载链接
  - 将表格中的行数据（row=>values）渲染到弹出层
  - getdataList 和 setdatalist 创建下拉框option
  - alertSuccess 和 alertError


## server

NodeJS 后端 /routes

- checkin.js
- index.js
- resultSearch.js
- user.js


## 开发环境/测试环境
测试环境端口: 3006

## 数据库

### 数据备份 

|Date |目标文件 |备份数据库表1 |备份数据库表2 |
|:----:|:-----:|:-----:|:-----:|
|03-24-2020|Ipluggable_03-24-2020.xlsb |Ipluggable_test|Ipluggable_test1|




## 添加单元测试框架
1. Unit Test
   
   Mocha + Istanbul

```
npm i -D mocha

```

Add test to package.json scripts node as below.

```
"scripts": {
    "start": "node ./bin/www",
    "test": "mocha"
}
```

Run npm test, will get result in the terminal.

```
> mocha



  Array
    #indexOf()
      √ should return -1 when the value is not present


  1 passing (5ms)
```

2. 代码覆盖率 Code Coverage

新版本Istanbul命令行工具已经改为nyc。

```
npm i -D nyc
```

修改package.json

```
{
  "scripts": {
    "test": "nyc mocha --timeout=3000"
  }
}
```

运行npm test，得结果如下：

```
> nyc mocha --timeout=3000



  Array
    #indexOf()
      √ should return -1 when the value is not present


  1 passing (8ms)

----------|----------|----------|----------|----------|-------------------|
File      |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
----------|----------|----------|----------|----------|-------------------|
All files |        0 |        0 |        0 |        0 |                   |
----------|----------|----------|----------|----------|-------------------|

```

