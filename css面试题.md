1. offsetWidth，clientWidth和scrollWidth的区别等
   - offsetWidth:  leftPadding + rightPadding + width + + borderWidth + scrollbar.width(竖滚动条宽度)

- clientWidth: leftPadding + rightPadding + width - scrollbar.width(竖滚动条宽度)
- scrollWidth: scrollTop + clientWidth（不计border和滚动条高度）
- offsetLeft：border外层距离父元素的border内层的距离（父元素需要非static定位，若无则是html标签）
- clientY：距离浏览器可视范围顶部的距离
- pageY：距离document最顶部的距离（滚动距离也计算）

1. 盒子模型的宽度如何计算

   - 取决于box-sizing属性：

     1) content-box(默认)： width +  scrollbar.width

     2) border-box：width + scrollbar.width + padding + border

2. margin纵向重叠问题

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

3. margin负值的问题

   - `margin-left ` 和 `margin-top`：自身向左或上移动距离
   - `margin-right` 和 `margin-bottom`：自身不变，右侧/下方元素移动距离

4. BFC（block format context）的理解和应用

   - 定义：一块独立渲染的区域，内部的渲染不会影响到外部的元素
   - 形成的条件：
     - float不为none
     - display为flex或table
     - position为absolute或fixed
     - overflow不为visible
   - 应用场景：清除浮动

5. float布局的问题，以及clearfix

6. flex布局

7. 绝对定位和相对定位

8. 居中对齐的方式

9. line-height的继承问题

10. rem是什么

11. 如何实现响应式

12. css3动画