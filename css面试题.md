### 一、CSS基础

##### 1. CSS选择器及权重

权重之间的进制是256的，也就是1和10之间相差了255。`!import`优先级最高，优先级相同的情况下，后者会覆盖前者的样式。

| 选择器    | 格式          | 权重   |
| ------ | ----------- | ---- |
| ID选择器  | #id         | 100  |
| 类选择器   | .class      | 10   |
| 伪类选择器  | :hover      | 10   |
| 属性选择器  | [index="1"] | 10   |
| 标签选择器  | div         | 1    |
| 伪元素选择器 | ::before    | 1    |
| 相邻选择器  | h1 + li     | 0    |
| 子选择器   | div > span  | 0    |
| 后代选择器  | div span    | 0    |
| 通配符    | *           | 0    |

##### 2. display的属性值及作用

| 属性值          | 作用                                       |
| ------------ | ---------------------------------------- |
| none         | 不显示元素，从文档流中移除                            |
| block        | 块元素类型，宽度默认为父元素宽度，独占一行，可设置width、height、margin和padding |
| inline       | 行内元素，默认宽度为内容宽度，不可设置宽高，不独占一行，不能设置垂直方向的margin和padding，不能设置width和height |
| inline-block | 行内块元素，默认宽度为内容宽度，可设置宽高，不独占一行，对象为inline形式，但内容以block形式呈现 |
| inherit      | 继承，继承父元素的display属性                       |

##### 3. 隐藏元素的方法有哪些

- `display: none`：渲染树不包含该对象，不会在页面占据位置，不响应监听事件
- `visible: hidden`：元素仍占据空间，但不会响应监听事件
- `opacity: 0`：设置透明度为0，元素仍占据空间，可响应监听事件 
- `z-index: 负值`：利用其他元素来遮挡该元素，达到隐藏的目的
- `position: absolute`： 通过绝对定位将其移除可视范围
- `clip/clip-path `：使用剪裁来隐藏元素，仍占据位置，但不响应监听事件
- `transform: scale(0, 0)`： 通过缩放为0，来隐藏元素，但不会响应绑定的监听事件

##### 4. link和@import的区别

- link标签能定义rel等属性(`prefetch`,`preload`)，@import只能引入css样式
- link标签无兼容性问题，@import是css2.1提出的
- link标签是同时下载的，而@import需要读取完整个HTML文件后才进行下载
- link标签可通过DOM操作插入，@import不支持

##### 5. 

##### 5. display:none 与 visibility:hidden 的区别

- `display:none` 会让元素从渲染树中消失，`visibility:hidden` 的元素仍会占据原来的位置
- `display:none` 会造成重排，`visibility:hidden`只会造成重绘
- `display:none`的子元素随父元素从渲染树中消失，而`visibility:hidden` 是由于属性的继承，可以通过设置属性将子元素设置为可见

##### 6. 伪元素和伪类的区别和作用

- 伪元素：伪元素是在内容元素的前后插入额外的元素或样式，这些元素并不在文档中生成，在源代码中找不到

```js
p::before {
  content: '-';
}
```

- 伪类：将特殊的效果添加到特定的选择器上，不会产生新的元素

```js
p:hover {
  background: '#fff';
}
```

##### 7. 对 requestAnimationframe 的理解

> `window.requestAnimationFrame(callback)` 告诉浏览器 —— 你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。

- 语法：`window.requestAnimationFrame(callback)` ，该回调接受一个时间戳，返回一个`ID` ，可以通过`window.cancelAnimationFrame(id)` 取消执行该函数。该方法属于宏任务，会在执行完微任务之后去执行。
- 优势：
  + cpu节能：在后台或者隐藏的`iframe`中会停止执行
  + 减少DOM操作：在每一次回流或重绘中集中所有DOM操作，避免多次渲染

##### 8. offsetWidth，clientWidth和scrollWidth的区别等

- offsetWidth:  leftPadding + rightPadding + width + + borderWidth + scrollbar.width(竖滚动条宽度)


- clientWidth: leftPadding + rightPadding + width - scrollbar.width(竖滚动条宽度)
- scrollWidth: scrollTop + clientWidth（不计border和滚动条高度）
- offsetLeft：border外层距离父元素的border内层的距离（父元素需要非static定位，若无则是html标签）
- clientY：距离浏览器可视范围顶部的距离
- pageY：距离document最顶部的距离（滚动距离也计算）

##### 9. 盒子模型的宽度如何计算

- 取决于box-sizing属性：

  1) content-box(默认)： width +  scrollbar.width

  2) border-box：width + scrollbar.width + padding + border

##### 10. margin纵向重叠问题

```js
// 1. 空白的内容会被忽略
// 2. 纵向margin会合并，取较大的值
// 最终答案为15px
<style>
  p {
    margin-top: 10px;
    margin-bottom: 15;
  }
</style>

<body>
  <p>1</p>
  <p></p>
  <p>2</p>
</body>
```
##### 11. margin负值的问题

- `margin-left ` 和 `margin-top`：自身向左或上移动距离
- `margin-right` 和 `margin-bottom`：自身不变，右侧/下方元素移动距离
- 应用：不确定多少列的布局，给父元素`margin-right: -N px`，外层容器使用`overflow: hidden`

##### 12. CSS3的新特性

- 文字阴影：`text-shadow`
- 渐变：`gradient`
- 旋转、变化等：`translate`
- 圆角：`border-radius`
- 新的选择器：`:not:classname`

##### 13. 什么是物理像素，逻辑像素和像素密度，为什么在移动端开发时需要用到@3x, @2x 这种图片？

以 iPhone XS 为例，当写 CSS 代码时，针对于单位 px，其宽度为 414px * 896px，也就是说当赋予一个 DIV 元素宽度为 414px，这个 DIV 就会填满手机的宽度；

而如果有一把尺子来实际测量这部手机的物理像素，实际为 1242 * 2688 物理像素；经过计算可知，1242/414=3，也就是说，在单边上，一个逻辑像素=3 个物理像素，就说这个屏幕的像素密度为 3，也就是常说的 3 倍屏。

对于图片来说，为了保证其不失真，1 个图片像素至少要对应一个物理像素，假如原始图片是 500 * 300 像素，那么在 3 倍屏上就要放一个 1500 * 900 像素的图片才能保证 1 个物理像素至少对应一个图片像素，才能不失真。

##### 14. 对**line-height 的理解及其赋值方式**

(1) 概念：

- 如果没有定义`height`属性，那么元素高度由`line-height`决定
- `line-heigh`与`height`一样高时能实现文字垂直居中

(2) 赋值

- 带单位：`px`为固定值，`em`参考父元素的`font-size`
- 纯数字：如1.5，子元素`font-size: 18px`，则行高为27px
- 百分比：将计算后的值传递给后代

##### 15. CSS 优化和提高性能的方法有哪些？

- css压缩：将写好的css文件进行压缩，减少体积
- 样式单一：`margin: 0 10px 0 12px;`的性能不如`margin-right: 10px; margin-left: 12px;`
- 避免使用`color: red`、`font-weight: bold;`等样式，减少浏览器格式化样式表的工作
- 避免回流和重绘
- 雪碧图

##### 16. Sass、Less 是什么？为什么要使用他们？

- 语法结构清晰，便于后期维护
- 可定义变量，更加直观
- 可以方便地屏蔽浏览器私有语法差异

##### 17. 单行、多行文本溢出隐藏

```css
// 单行
overflow: hidden;
white-space: no-wrap;
text-overflow: ellipsis;

// 多行
overflow: hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 3;
```

##### 18. 对媒体查询的理解？

媒体查询由⼀个可选的媒体类型和零个或多个使⽤媒体功能的限制了样式表范围的表达式组成，例如宽度、⾼度和颜⾊。媒体查询，添加⾃ CSS3，允许内容的呈现针对⼀个特定范围的输出设备⽽进⾏裁剪，⽽不必改变内容本身，适合 web ⽹⻚应对不同型号的设备⽽做出对应的响应适配。

##### 19. 如何判断元素是否达到可视区域

以图片显示为例：

- `window.innerHeight` 是浏览器可视区的高度；
- `document.body.scrollTop || document.documentElement.scrollTop` 是浏览器滚动的过的距离；
- `imgs.offsetTop` 是元素顶部距离文档顶部的高度（包括滚动条的距离）；
- 内容达到显示区域的：`img.offsetTop < window.innerHeight + document.body.scrollTop;`

![判断可视区域](.\图\判断可视区域.png)

##### 20.  z-index 属性在什么情况下会失效，层叠上下文是什么

> 层叠上下文是一个逻辑模型，一个概念，我们可以通过各种方式来实现这个模型，就好比我们可以用 `JS` 来实现链表一样。该模型有一些特点，比如它把我们的某一块（比如 `div`）构建成一个三维模型，处于该三维模型中的元素就会有层叠顺序，即 `z` 轴的层级。

(1) 创建层叠上下文(非css3)：

- position为`relative ` 或 `absolute`，且`z-index`为数值的类型
- position为`fixed` 或 `sticky`

(2) 层叠上下文顺序

![层叠上下文](.\图\层叠上下文.jpg)

(3) z-index失效

```html
// .box1单独创建了层叠上下文，根据层叠顺序表，层叠上下文的background层叠等级低于z-index < 0
// 此时需要去掉.box1的定位，使其不为一个层叠上下文即可
<head>
  <style>
    .box1 {
      width: 200px;
      height: 200px;
      background-color: red;
      position: relative;
      z-index: 999;
    }
    .box1-1 {
      width: 50px;
      height: 50px;
      background-color: blue;
      position: relative;
      z-index: -1;
    }
  </style>
</head>
<body>
  <!-- 父级盒子 -->
  <div class="box1">
    <div class="box1-1"></div>
  </div>
</body>
```

### 二、页面布局

##### 1. 常见的 CSS 布局单位

常用的布局单位包括像素（px），百分比（%），em，rem，vw/vh。

**（1）像素（px）** 是页面布局的基础，一个像素表示终端（电脑、手机、平板等）屏幕所能显示的最小的区域，像素分为两种类型：

- CSS 像素和物理像素：CSS 像素：为 web 开发者提供，在 CSS 中使用的一个抽象单位；
- 物理像素：只与设备的硬件密度有关，任何设备的物理像素都是固定的。

**（2）百分比（%）**，当浏览器的宽度或者高度发生变化时，通过百分比单位可以使得浏览器中的组件的宽和高随着浏览器的变化而变化，从而实现响应式的效果。一般认为子元素的百分比相对于直接父元素。

**（3）em 和 rem** 相对于 px 更具灵活性，它们都是相对长度单位，它们之间的区别：em 相对于父元素，rem 相对于根元素。

- em： 文本相对长度单位。相对于当前对象内文本的字体尺寸。如果当前行内文本的字体尺寸未被人为设置，则相对于浏览器的默认字体尺寸(默认 16px)。(相对父元素的字体大小倍数)。
- rem： rem 是 CSS3 新增的一个相对单位，相对于根元素（html 元素）的 font-size 的倍数。作用：利用 rem 可以实现简单的响应式布局，可以利用 html 元素中字体的大小与屏幕间的比值来设置 font-size 的值，以此实现当屏幕分辨率变化时让元素也随之变化。

**（4）vw/vh** 是与视图窗口有关的单位，vw 表示相对于视图窗口的宽度，vh 表示相对于视图窗口高度，除了 vw 和 vh 外，还有 vmin 和 vmax 两个相关的单位。

- vw：相对于视窗的宽度，视窗宽度是 100vw；
- vh：相对于视窗的高度，视窗高度是 100vh；
- vmin：vw 和 vh 中的较小值；
- vmax：vw 和 vh 中的较大值；

vw/vh 和百分比很类似，两者的区别：百分比（%）：大部分相对于祖先元素，也有相对于自身的情况比如（border-radius、translate 等)vw/vm：相对于视窗的尺寸

##### 2. px、em、rem 的区别及使用场景三者的区别：

- px 是固定的像素，一旦设置了就无法因为适应页面大小而改变。
- em 和 rem 相对于 px 更具有灵活性，他们是相对长度单位，其长度不是固定的，更适用于响应式布局。
- em 是相对于其父元素来设置字体大小，这样就会存在一个问题，进行任何元素设置，都有可能需要知道他父元素的大小。而 rem 是相对于根元素，这样就意味着，只需要在根元素确定一个参考值。

使用场景：

- 对于只需要适配少部分移动设备，且分辨率对页面影响不大的，使用 px 即可 。
- 对于需要适配各种移动设备，使用 rem，例如需要适配 iPhone 和 iPad 等分辨率差别比较挺大的设备。

##### 3. 两栏布局的实现

- flex布局：

```css
.outer {
  width: 1000px;
  height: 300px;
  border: 2px solid #000;
  display: flex;
}
.left {
  width: 200px;
  background-color: blue;
}
.right {
  flex: 1;
  background-color: green;
}
```

- 浮动：

```css
.outer {
  width: 1000px;
  height: 300px;
  border: 2px solid #000;
}
.left {
  width: 200px;
  height: 100%;
  float: left;
  background-color: blue;
}
.right {
  height: 100%;
  margin-left: 200px;
  background-color: green;
}
```

- 定位：

```css
.outer {
  width: 1000px;
  height: 300px;
  border: 2px solid #000;
  position: relative;
}
.left {
  width: 200px;
  height: 300px;
  position: absolute;
  left: 0;
  background-color: blue;
}
.right {
  margin-left: 200px;
  height: 300px;
  background-color: green;
}
```

##### 4. 三栏布局的实现

- 圣杯布局：利用父元素padding、子元素margin负值和相对定位实现，`right-box` 使用`margin-right`的原因是需要以父盒子的右侧(`content`)为基准进行偏移

```html
<style>
.outer {
  width: 1000px;
  height: 300px;
  padding-left: 200px;
  padding-right: 200px;
}

.center {
  float: left;
  width: 100%;
  height: 100%;
  background: yellow;
}

.left {
  float: left;
  width: 200px;
  height: 300px;
  margin-left: -100%;
  position: relative;
  left: -200px;
  background-color: blue;
}

.right {
  float: left;
  width: 200px;
  height: 100%;
  margin-right: -200px;
  background-color: green;
}

</style>

<body>
  <div class="outer">
    <div class="center"></div>
    <div class="left"></div>
    <div class="right"></div>
  </div>
</body>

```

- 双飞翼布局：原理与圣杯布局类似，但`right-box`利用了`margin-left: -200px`，因为实际内容还在父盒子的`box-content`内

```html
<style>
.outer {
  width: 1000px;
  height: 300px;
}

.wrapper {
  float: left;
  width: 100%;
  height: 300px;
}
  
.center {
  height: 100%;
  margin-left: 200px;
  margin-right: 200px;
  background: yellow;
}

.left {
  float: left;
  width: 200px;
  height: 300px;
  margin-left: -100%;
  background-color: blue;
}

.right {
  float: left;
  width: 200px;
  height: 100%;
  margin-left: -200px;
  background-color: green;
}

</style>

<body>
  <div class="outer">
    <div class="wrapper">
      <div class="center"></div>
    </div>
    <div class="left"></div>
    <div class="right"></div>
  </div>
</body>
```

- flex布局：

```css
.outer {
  display: flex;
  height: 100px;
}

.left {
  width: 100px;
  background: tomato;
}

.right {
  width: 100px;
  background: gold;
}

.center {
  flex: 1;
  background: lightgreen;
}
```

##### 5. 水平垂直居中的实现

- 绝对定位：

```css
.parent {
  position: relative;
}
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

- flex：

```css
.parent {
  display: flex;
  justify-content: centet;
  align-items: center;
}
```

##### 6. 如何根据设计稿进行移动端适配？





##### 12. BFC（block format context）的理解和应用

- 定义：一块独立渲染的区域，内部的渲染不会影响到外部的元素
- 形成的条件：
  - float不为none
  - display为flex或table
  - position为absolute或fixed
  - overflow不为visible
- 应用场景：清除浮动



1. float布局的问题，以及clearfix

2. flex布局

3. 绝对定位和相对定位

4. 居中对齐的方式

5. line-height的继承问题

6. rem是什么

7. 如何实现响应式

8. css3动画