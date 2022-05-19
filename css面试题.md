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

##### 1. offsetWidth，clientWidth和scrollWidth的区别等

- offsetWidth:  leftPadding + rightPadding + width + + borderWidth + scrollbar.width(竖滚动条宽度)


- clientWidth: leftPadding + rightPadding + width - scrollbar.width(竖滚动条宽度)
- scrollWidth: scrollTop + clientWidth（不计border和滚动条高度）
- offsetLeft：border外层距离父元素的border内层的距离（父元素需要非static定位，若无则是html标签）
- clientY：距离浏览器可视范围顶部的距离
- pageY：距离document最顶部的距离（滚动距离也计算）

##### 2. 盒子模型的宽度如何计算

- 取决于box-sizing属性：

  1) content-box(默认)： width +  scrollbar.width

  2) border-box：width + scrollbar.width + padding + border

##### 3. margin纵向重叠问题

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
##### 4. margin负值的问题

- `margin-left ` 和 `margin-top`：自身向左或上移动距离
- `margin-right` 和 `margin-bottom`：自身不变，右侧/下方元素移动距离

##### 5. BFC（block format context）的理解和应用

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