### 一、优势
- 不需要将所有文件都进行打包，直接进行转换，转为ES6代码，效率更高，省去大量配置的步骤。
- 会进行预打包，没有改动的情况下能节省时间
- 使用ESBuild(打包速度快)：
  + 支持ES6和commonJS
  + 支持ES6的TreeShaking
  + 支持TS、JSX等语法的编译
  + 支持SourceMap
  + 支持代码压缩
  + 支持其他扩展插件

### 二、原理
本地搭建了服务器，请求的文件还是原来的文件，如`.less/.ts`。但实际内部代码已经被转换为ES6的代码。本质上利用了connect对请求进行了一个转发。

### 三、使用
- 对vue的支持：
  + Vue3单文件组件的支持：`@vitejs/plugin-vue`
  + Vue3JSX文件的支持：`@vitejs/plugin-vue-jsx`
  + Vue2支持：`underfin/vite-plugin-vue2`
- 打包：npx vite build
- vite脚手架：
  + `cnpm install @vitejs/create-app -g`
  + `create-app my-project`