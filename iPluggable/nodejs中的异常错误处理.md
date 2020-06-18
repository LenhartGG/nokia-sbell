# nodejs中的异常错误处理

nodejs异常导致程序崩溃，这个之前困扰我许久的问题终于得到了解决，就好像我心中的疙瘩解开了，于是我迫不及待地想记录一下我总结的方法。

异常处理是程序运行中必须要关注的地方，当异常出现后，应该第一时间关注到，并且快速解决。大部分程序员们都不敢保证自己的代码百分比正确，所以应该在写代码时就要对异常提前做预防处理，尽量保证在异常出现时，给用户一个友好的提示，不至于服务挂起导致请求超时，并且能将异常信息做记录上报，方便后期排查解决。

nodejs 是单线程的，当程序中产生未处理的异常时，会导致程序的崩溃，我总结了网上几种处理方法：

## 在nodejs中的异常捕获

### 1.使用uncaughtException


我们可以uncaughtException来全局捕获未捕获的Error，同时你还可以将此函数的调用栈打印出来，捕获之后可以有效防止node进程退出，如： 

```
process.on('uncaughtException', function (err) {
  //打印出错误
  console.log(err);
  //打印出错误的调用栈方便调试
  console.log(err.stack)；
});
```

这相当于在node进程内部进行守护， 但这种方法很多人都是不提倡的，说明你还不能完全掌控Node.JS的异常。 

### 2.使用 try/catch

我们可以在回调前加try/catch，以确保线程的安全。 

```
var http = require('http');

http.createServer(function(req, res) {
  try {
    handler(req, res);
  } catch(e) {
    console.log('\r\n', e, '\r\n', e.stack);
    try {
      res.end(e.stack);
    } catch(e) { }
  }
}).listen(8080, '127.0.0.1');

console.log('Server running at http://127.0.0.1:8080/');

var handler = function (req, res) {
  //Error Popuped
  var name = req.params.name;

  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello ' + name);
};
```

这种方案的好处是，可以将错误和调用栈直接输出到当前发生的网页上。 

## 在express官方文档中有几种推荐的方法：

### 1.捕捉错误

确保Express能够捕获运行路由处理程序和中间件时发生的所有错误，这一点很重要。

路由处理程序和中间件内部的同步代码中发生的错误不需要任何额外的工作。如果同步代码引发错误，则Express将捕获并处理该错误。例如：

```
app.get('/', function (req, res) {
  throw new Error('BROKEN') // Express will catch this on its own.
})
```

对于由路由处理程序和中间件调用的异步函数返回的错误，必须将它们传递给next()Express捕获并处理它们的函数。例如：

```
app.get('/', function (req, res, next) {
  fs.readFile('/file-does-not-exist', function (err, data) {
    if (err) {
      next(err) // Pass errors to Express.
    } else {
      res.send(data)
    }
  })
})
```

如果将任何内容传递给该next()函数（字符串除外'route'），Express都会将当前请求视为错误，并且将跳过所有剩余的非错误处理路由和中间件函数。

如果序列中的回调不提供数据，仅提供错误，则可以按以下方式简化此代码：

```
app.get('/', [
  function (req, res, next) {
    fs.writeFile('/inaccessible-path', 'data', next)
  },
  function (req, res) {
    res.send('OK')
  }
])
```

在以上示例next中，提供了作为的回调fs.writeFile，无论有无错误都将调用该回调。如果没有错误，则执行第二个处理程序，否则Express捕获并处理该错误。

您必须捕获由路由处理程序或中间件调用的异步代码中发生的错误，并将它们传递给Express进行处理。例如：

```
app.get('/', function (req, res, next) {
  setTimeout(function () {
    try {
      throw new Error('BROKEN')
    } catch (err) {
      next(err)
    }
  }, 100)
})
```
上面的示例使用一个try...catch块来捕获异步代码中的错误，并将它们传递给Express。如果try...catch 省略了该块，则Express将不会捕获该错误，因为它不是同步处理程序代码的一部分。

使用Promise可以避免try..catch块的开销，或者在使用返回Promise的函数时。例如：

```
app.get('/', function (req, res, next) {
  Promise.resolve().then(function () {
    throw new Error('BROKEN')
  }).catch(next) // Errors will be passed to Express.
})
```

由于promise会自动捕获同步错误和已拒绝的promise，因此您可以简单地提供next作为最终捕获处理程序，而Express将捕获错误，因为捕获处理程序将错误作为第一个参数。

您还可以使用一系列处理程序来依靠同步错误捕获，方法是将异步代码减少到一些琐碎的事情。例如：

```
app.get('/', [
  function (req, res, next) {
    fs.readFile('/maybe-valid-file', 'utf-8', function (err, data) {
      res.locals.data = data
      next(err)
    })
  },
  function (req, res) {
    res.locals.data = res.locals.data.split(',')[1]
    res.send(res.locals.data)
  }
])
```

上面的示例从readFile 调用中获得了一些简单的语句。如果readFile导致错误，则将错误传递给Express，否则您将快速回到链中下一个处理程序中的同步错误处理领域。然后，上面的示例尝试处理数据。如果失败，则同步错误处理程序将捕获该错误。如果您已在readFile回调中完成此处理，则应用程序可能会退出并且Express错误处理程序将无法运行。

无论使用哪种方法，如果都希望调用Express错误处理程序并使应用程序继续存在，则必须确保Express收到错误。

### 2.默认错误处理程序

```
function errorHandler (err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500)
  res.render('error', { error: err })
} 
```

### 3.编写错误处理程序

定义错误处理中间件功能的方式与其他中间件功能相同，只是错误处理功能具有四个参数而不是三个参数 (err, req, res, next)。例如：

```
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
```

您最后定义错误处理中间件，之后再定义app.use()并路由调用；例如：

```
var bodyParser = require('body-parser')
var methodOverride = require('method-override')

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(methodOverride())
app.use(function (err, req, res, next) {
  // logic
})
```

来自中间件功能的响应可以是任何格式，例如HTML错误页面，简单消息或JSON字符串。

出于组织（和更高级别的框架）的目的，您可以定义多个错误处理中间件功能，就像使用常规中间件功能一样。例如，为使用XHR和不使用的请求定义错误处理程序：

```
var bodyParser = require('body-parser')
var methodOverride = require('method-override')

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(methodOverride())
app.use(logErrors)
app.use(clientErrorHandler)
app.use(errorHandler)
```

在此示例中，泛型logErrors可能会将请求和错误信息写入stderr，例如：

```
function logErrors (err, req, res, next) {
  console.error(err.stack)
  next(err)
}
```

同样在此示例中，clientErrorHandler定义如下：在这种情况下，错误将明确传递给下一个错误。

请注意，在错误处理函数中不调用“ next”时，您负责编写（并结束）响应。否则，这些请求将“挂起”，并且不符合垃圾回收的条件。

```
function clientErrorHandler (err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' })
  } else {
    next(err)
  }
}
```

但是当我按照官方文档全局添加了错误处理，在下载文件的时候还是会有异常没有处理。场景：通过a标签的download属性下载文件，如果文件不存在，在chrome浏览器发送的报文可以捕获到异常，但是在firefox浏览器中express捕获不到异常导致程序崩溃，报错代码如下：
```
{ NotFoundError: Not Found
    at /xxx/app.js
    ...}
GET /1AB376350001_1.PNG 404 3.754 ms - 274
```
这是因为在chrome和firefox中下载文件请求头的content-type格式不一致，需要分类处理
（来自中间件功能的响应可以是任何格式，例如HTML错误页面，简单消息或JSON字符串）。
```
// when status is 404, error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  if( 404 === err.status  ){
      res.format({
          'text/plain': () => {
              res.send({message: 'not found Data'});
          },
          'text/html': () => {
              res.render('404.html');
          },
          'application/json': () => {
              res.send({message: 'not found Data'});
          },
          'default': () => {
              res.status(406).send('Not Acceptable');
          }
      })
  }

  // when status is 500, error handler
  if(500 === err.status) {
      return res.send({message: 'error occur'});
  }
});
```

总结：

1. 局部捕捉异常，需要捕获运行路由处理程序和中间件时发生的所有错误

2. 在全局处理异常时，最好还是对异常进行分类（例如HTML错误页面，简单消息或JSON字符串）

如有疏漏，请不吝指正，后续会继续更新，敬请期待。。。

## 参考文档：

1. https://www.expressjs.com.cn/4x/api.html

2. https://www.cnblogs.com/cnxkey/articles/7442203.html