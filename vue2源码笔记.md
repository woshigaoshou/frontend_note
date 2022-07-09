### 一、 源码构建

##### 1. 为什么Vue用function定义而不用class

为了拆分逻辑，把不同的逻辑封装在prototype里面

##### 2. 函数原型方法劫持

切片编程

##### 3. 用到常量（数字或字符串），用const

##### 4. 编译

正则匹配前需重置lastIndex

_c：创建DOM

_v：纯文本，text

_s：需解析{{}}语法，textVNode

转换render函数的目的是，避免多次转换ast语法树（大量正则匹配消耗性能

##### 5. 策略模式，定义一个对象，里面定义多种策略方法，key匹配到时，直接通过key调用策略即可

##### 6. 赋值 function extend (to, from) {}

##### 7.源码目录结构 

- benchamarks 性能测试
- dist 打包文件
- examples 官方例子
- flow 类型检测
- packages 一些写好的包
- scripts 所有打包的脚本
- src 源码目录
  - compiler 模板编译
  - core vue2核心代码
  - platform 与平台有关，主要关注web
  - server 服务端渲染相关
  - sfc 解析单文件组件
  - shared 模块之间的共享属性和方法