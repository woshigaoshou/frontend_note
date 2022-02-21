### TS与JS的区别：TS是拥有类型的JS超集，可以被编译成普通，干净完整的JS代码
- 转换过程：TS -> tsc(编译) -> JS代码 -> 运行在浏览器
- 运行环境(自动编译)：
  + webpack配置
  + ts-node：cnpm install `ts-node`、`tslib`、`@types/node`
- 类型检测

| 类型系统特性     | JavaScript | TypeScript |
| ---------- | ---------- | ---------- |
| 类型是如何绑定    | 动态         | 静态         |
| 是否存在类型隐式转换 | 是          | 否          |
| 何时检查类型     | 运行时        | 编译时        |
| 何时报告错误     | 运行时        | 编译时        |

- 类型注解和数据类型：
  + number、string、boolean、symbol、undefine、null六种基本数据类型和Array、Object复杂数据类型。
  + ts中特有的类型：any(可赋值给任意类型)、unknown(只能赋值给any和Unknown类型、never类型(表示没有这种类型)、tuple类型(元组，定义可以存储不同类型数据的数组)
  ```typescript
  // never类型应用场景，传参为联合类型
  function foo(message: string|number) {
      switch(typeof message) {
          case string: console.log('string');break;
          case number: console.log('number');break;
          default: 
            const check: never = message; // 此时报错
      }
  }
  // 元组
  const info: [string, number] = ['abc', 123];
  // 可选类型
  function printPoint(point: {x: number, y: number, z?: number}) {
      
  }
  ```
  + 复杂类型定义：`const arr: string[] = [];` ,`const obj = {}`
  + `string/number等`，`String/Number`为js的包装类，两者不同。
  + 声明时没有注解，会进行类型推导
  + 字面量类型：const direction: 'left'|'right' = 'left';
  + 枚举(enum)：枚举的变量默认值为0，之后递增
- 函数：
  + 定义：一般定义函数给类型注解，而上下文函数则一般不写，如string数组的forEach传入的函数
  + 类型：
    * `() => void` // 允许返回任何值
    * (params) => number
  + 可选：必传参数必须在可选参数前面
  + 剩余参数：将不定数量的参数转换为数组`function (...numArr) {}`
  + 重载：
```typescript
// 函数声明和函数体分开,能用联合类型就不用重载
function add(num1: number, num2: number): number;
function add(num1: string, num2: string): string;
function add(num1: any, num2: any): any {
    return num1 + num2;
};
// 联合类型实现
function add(args: string|any[]) {
    return args.length;
}
```
- 运算符
  + `?:`可选
  + `?.`可选链
  + 断言(as)：断言该变量为xx类型，否则会报错，如
```typescript
function getLength(something: string | number): number {
    if ((<string>something).length) {
        return (<string>something).length;
    } else {
        return something.toString().length;
    }
}

```
  + `!`非空断言
  + `!!`转为boolean值
  + `??`空值合并操作符，左侧为null或undefined时返回右侧
  + `|`联合类型
  + `&`交叉类型，同时满足两个条件，如两个类的交叉
- type关键字：用于定义类型别名，如`type IDType = string | number`
- 类型缩小(以下为类型保护)：
  + `typeof`、`instanceof`
  + `===`、`!==`、`switch`
  + `in`
- 类(class)
  + 私有属性以下划线开头`_name`
  + 可通过extends关键字进行继承。
  + 可通过super关键字来调用父类的构造函数和普通函数。
  + 调用函数时，先到子类中查找，若无再到父类查找该方法
  + 父类的方法的变量指向父类的实例，子类的方法变量指向子类的实例，因此可  在子类的构造函数中这样声明：  
    `super(x,y); this.x=x;this.y=y // 后面的为子类的变量`
  + class关键字不会进行变量提升
  + 只读属性：只能在构造函数修改
  ```typescript
  class Person {
      readonly _name: string;
      constrctor(name) {
          this.name = name
      }
      Set name(newName) {
        this._name = newName;
      }
      Get name() {
        return this._name;
      }
  }
  ```
  + 静态变量和方法只能在构造函数内部访问(`static`)，实例无法访问
  + 修饰符：`public`(默认)、`private`(只能在class内部访问)、`protected`(  内部或子类访问)
  + 作为对象，子类的__proto__指向父类，作为构造函数，子类的prototype指向父类的实例
  + 抽象类：
  ```typescript
  abstract class Shape{
    abstract getArea(): number;
  }

  class rectangle extends Shape {
    private width:number;
    private height:number;
    constructor (width:number, height:number) {
      super();
      this.width = width;
      this.height = height;
    }
    getArea () {
      return this.width * this.height;
    }
  }

  class circle extends Shape {
    private r:number;
    constructor (r:number) {
      super();
      this.r = r;
    }
    getArea () {
      return this.r * this.r * 3.14;
    }
  }
  ```
- 接口(interface)：定义注解，不需要反复定义
  + 继承(extends)：定义的接口可被继承
  + readOnly(只读)
  + ?(可选)
  + [propName: string]，扩展，如：
  ```typescript
  // 索引类型
  interface IndexLanguage {
      [index: number]: string
  }
  const language: IndexLanguage = {
      0: 'xxx',
      1: 'xxx'
  }
  // 函数类型
  interface Fn {
      (num1:number, num2:number): number;
  }
  // 继承
  interface dog extends Animate,Person {
      
  }
  // 接口实现
  class fish extends Animate implements ISwim {
      
  }
  function action(swimable: ISwim) { // 此时可以传入对象，内部符合ISwim接口即可
      
  }
  // 字面量赋值(freshness)
  interface Person {
      name: 'John',
      height: 1.88
  }
  const info: Person = { // 报错
      name: 'Tom',
      height: 1.72,
      hobby: 'swimming'
  }
  // 使用freshness
  const info1 = {
      name: 'Tom',
      height: 1.72,
      hobby: 'swimming'
  }
  const info2: Person = info1;
  ```
  + 可重复定义：两个相同命名的接口内部属性会进行合并
- 泛型(generics)：
  + 作用：将类型进行参数化
  + 防止追加类型时需要同时添加好几个，此时使用泛型
  + extends，用于指定传入哪几种类型，对传入泛型进行限制
   ```typescript
    // 泛型函数
    function test
    <
     T extends number | string,
     Y extends number | string
    >(a: T, b: Y) {
     console.log(a, b)
    }
    test<number, string>(18, "b-name")

    // 通过泛型约束函数返回值
    function useStore(): Store<IStoreType> {
      return useVuexStore()
    }
    // 泛型接口
    interface IPerson<T1 = string, T2 = number> {
        name: T1,
        age: T2
    }
    const person: IPerson<string, number> = {
        name: 'John',
        age: 18
    }
    // 泛型类
    class Person<T> {
        name: T
        constructor(name: T) {
            this.name = name;
        }
    }
   ```
- 命名空间：
```typescript
namespace time {
    format(time: number) {
        return '1999-09-09';
    }
}
```
- 类型的声明：`.d.ts`文件(declare)
  + 内置的声明：`TypeScript/blob/main/lib`
  + 外部定义类型声明：`typescriptlang.org/dt`(类型声明文件下载)
  + 自定义声明：
  ```js
  // xxx.d.ts
  declare module 'lodash' {
      export function join(arr: any[]): void
  }
  ```
  + 声明函数/变量/类
  ```typescript
  // index.html
  <script>
    let name = 'John';
  </script>
  // xxx.d.js
    declare let name: string;
    declare function foo(): void;
    declare class Person {
        name: string,
        age: number,
        constructor(name: string, age:number) {
            this.name = name;
            this.age = age;
        }
    }
    declare module '*.jpg'; // 声明jpg文件
    declare namespace $ {
        export function ajax(settings: any): any
    }
  ```


