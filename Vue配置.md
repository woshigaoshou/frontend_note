### 一、.editorconfig配置

```
// .editorconfig，同时需要安装EditorConfig插件
root = true                         # 根目录的配置文件，编辑器会由当前目录向上查找，如果找到 `roor = true` 的文件，则不再查找

[*]
indent_style = space                # 空格缩进,可选"space"、"tab"
indent_size = 2                     # 缩进空格为4个
end_of_line = lf                    # 结尾换行符，可选"lf"、"cr"、"crlf"
charset = utf-8                     # 文件编码是 utf-8
trim_trailing_whitespace = true     # 不保留行末的空格
insert_final_newline = true         # 文件末尾添加一个空行
curly_bracket_next_line = false     # 大括号不另起一行
spaces_around_operators = true      # 运算符两遍都有空格
indent_brace_style = 1tbs           # 条件语句格式是 1tbs

[*.js]                              # 对所有的 js 文件生效
quote_type = single                 # 字符串使用单引号

[*.{html,less,css,json}]            # 对所有 html, less, css, json 文件生效
quote_type = double               # 字符串使用双引号

[package.json]                      # 对 package.json 生效
indent_size = 2                     # 使用2个空格缩进
```

###  二、eslint + prettier(shift+alt+f)

```
// .eslintrc.js
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint",
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  }
};
```

```
// .eslintignore
dist/
public/
```

```
// .prettierrc
{
  printWidth: 80, //单行长度
  tabWidth: 2, //缩进长度
  useTabs: false, //使用空格代替tab缩进
  semi: true, //句末使用分号
  singleQuote: true, //使用单引号
  quoteProps: 'as-needed', //仅在必需时为对象的key添加引号
  jsxSingleQuote: true, // jsx中使用单引号
  trailingComma: 'all', //多行时尽可能打印尾随逗号
  bracketSpacing: true, //在对象前后添加空格-eg: { foo: bar }
  jsxBracketSameLine: true, //多属性html标签的‘>’折行放置
  arrowParens: 'always', //单参数箭头函数参数周围使用圆括号-eg: (x) => x
  requirePragma: false, //无需顶部注释即可格式化
  insertPragma: false, //在已被preitter格式化的文件顶部加上标注
  proseWrap: 'preserve', //不知道怎么翻译
  htmlWhitespaceSensitivity: 'ignore', //对HTML全局空白不敏感
  vueIndentScriptAndStyle: false, //不对vue中的script及style标签缩进
  endOfLine: 'lf', //结束行形式
  embeddedLanguageFormatting: 'auto', //对引用代码进行格式化
}
```

```
// .prettierignore
/dist/*
.local
.output.js
/node_modules/**

../*.svg
../*.sh

/public/*
```

### 三、husky

```
1. git init
2. npx husky-init && npm install
3. 按照个人需求修改.pre-commit命令
```

### 四、区分不同环境

1. 根据`process.env.NODE_ENV`
   - 开发环境：`development`
   - 测试环境：`test`
   - 生产环境：`production`
2. 配置环境变量：
   - 开发环境：`.env.development`
   - 测试环境：`.env.test`
   - 生产环境：`.env-prodction`
3. 打包：配置 `publicPath`，之后会在静态资源的前面拼接`publicPath`的路径

### 五、兼容浏览器

- `.browerserlistrc`

