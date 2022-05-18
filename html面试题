##### 1. 如何理解HTML语义化

- 常见语义化标签：`header`、`nav`、`aside`、`footer`、`section`、`main`等;


   - 代码的可读性更强；便于开发和维护
   - 有利于SEO搜索（提升搜索引擎的排名）

##### 2. 哪些标签是块级元素，哪些是内联元素

- 块级元素：display: block/table; 常见的有`h1~h6`、`p`、`ul`、`li`、`table`、`div`等
- 内联元素：display: inline/inline-block; 常见的有 `span`、`input`、`img`、`button`等
- 空标签：没有闭合标签；如`input`、`img`、`br`等

##### 3. `href` 和 `src`的区别：

- href：
  - 用于`a` 和 `link` 标签；
  - 使用时不会影响到页面其他资源的加载；
  - 不会替换本身的内容
  - 代表标签是网站的附属资源，没有并不造成逻辑的影响（因此css用link标签引入）
- src：
  - 用于`img` 、 `video` 、`script` 、`iframe` 标签；
  - 使用时会暂停页面其他资源的加载，直到该资源加载、编译和执行完；(因此一般放在脚本底部)
  - 会替换本身的内容，如script本身的内容不会被执行
  - 代表标签本身是网站的一部分

##### 4. DOCTYPE(文档类型)的作用

DOCTYPE是HTML5标准通用标记语言的文档类型声明，作用是告诉浏览器以哪种 **文档类型定义(DTD)** 来解析页面，通过 `document.compatMode` 来查看模式，最常见的影响是在ie6、ie7、ie8下怪异模型的盒模型为怪异盒模型(`box-sizing: border-box`)

- CSS1Compat：标准模式(Strick mode)，默认使用W3C的标准解析渲染页面
- BackCompat：怪异模式/混杂模式(Quick mode)，使用浏览器自己的怪异模式解析渲染页面

##### 5. script 标签中 defer 和 async 的区别

当解析HTML标签遇到script时，浏览器会停止解析，开始下载，执行该脚本，直至执行完成，才继续解析HTML

- async：当script标签具有async属性时，会先并行下载脚本，等待下载完成后，停止解析HTML，先执行脚本，再进行解析
- defer：当script标签具有defer属性时，会暂时忽略该标签，等HTML解析完成后，再进行脚本的下载和解析
- 当两个属性都存在时，async优先级更高

##### 6.常见的meta标签有哪些

meta标签由`name` 和 `content` 属性定义，用来描述网页文档的属性

- `charset`：字符集，用来描述HTML文档的编码类型

  `<meta name="charset" content="UTF-8" />`

- `keyword`：页面关键词

  `<meta name="keyword" content="关键词" />`

- `description`：页面描述

  `<meta name="description" content="页面描述内容" />`

- `refresh`：页面重定向

  `<meta name="refresh" content="0;url=" />`

- `viewport`：视口

  `<meta name="viewport" content="initial-scale=1;maxinum=1;mininum=1;user-scalable=no" />`

- `http-equiv`：IE适配

  `<meta name="http-equiv" content="IE=edge;chrome=1" />`

  按照最新的IE标准来渲染，有`Google Chrome Frame`插件，就用chrome内核渲染页面

##### 7. HTML5有哪些更新

##### (1) 语义化标签：

+ header：定义文档的页眉
+ nav：定义导航链接的部分
+ footer：定义文档底部
+ section：定义文档中的节
+ article：定义文章内容
+ aside：定义侧边栏

##### (2) 媒体标签：

+ audio：音频

```js
<audio src='' controls autoplay loop='true'></audio>
```

+ video：视频

```js
<video src='' poster='imgs/aa.jpg' controls></video>
```

+ source标签

```js
// 因为浏览器对视频格式支持程度不一样，为了能够兼容不同的浏览器，可以通过 source 来指定视频源。
<video>
    <source src='aa.flv' type='video/flv'></source>
    <source src='aa.mp4' type='video/mp4'></source>
</video>
```

##### (3) 表单

- 表单类型
  + email
  + url
  + search
- 表单属性
  + placeholder
  + autofocus
  + required
- 触发事件
  + onInvalid
  + onIput

##### (4) DOM 查询操作

- `document.querySelect`
- `document.querySelectAll`

##### (5) Web存储

- `localStorage`
- `sessionStorage`

##### (6) 其他

- drag：拖放API

##### 8. Web Worker

- Web Worker是HTML5标准的一部分，他允许一段JS代码运行在主线程之外的另一个线程中。为JS创造多多线程环境，允许主线程创建Worker线程，将一些任务分配给后者使用。

```js
// main.js
const worker = new Worker('worker.js');
worker.onmessage = (e) => {
  console.log(e);
};
worker.postMessage('ping');
worker.terminate();

// worker.js
self.onmessage = e => {
  console.log('received');
  postMessage('return');
}
```

##### 9. Svg和Canvas的区别

- **Svg**：Svg是基于可扩展标记语言XML绘制的2D图形，每个DOM都是可用的，可为某个元素添加JS事件处理器。如果Svg的属性发生变化，浏览器能够自动重绘。其特点如下：
  + 不依赖分辨率
  + 支持事件处理器
  + 适合大型渲染区域的应用程序
  + 不适合游戏应用
- **Canvas**：Canvas是画布，通过JavaScript进行绘制的2D图形，其位置发生变化就需要重新渲染。其特点如下：
  + 依赖分辨率
  + 不支持事件处理器
  + 能以jpg或png格式进行保存图像
  + 适合游戏应用

##### 10. head标签的作用

- 作为头部元素的容器，一般包含的元素都不会作为真正的内容展示给用户
- 常放的标签有：`meta`、`title`、`link`、`script`、`style` 等










