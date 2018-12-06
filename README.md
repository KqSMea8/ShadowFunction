# ShadowFunction
该方案能让你的网页安全的植入第三方代码，在运行时分配沙箱隔离，被隔离代码在调用"location, top, document.cookie, alert, console, prototype"等时均会被拦截及记录操作行为并返回空值，同时运行器也能对代码设置类操作权限，以控制代码的有效操作。

gitbook: https://shadow-function.gitbook.io

# 上手
npm 安装：
```bash
$ npm install shadow-function --save
```
简单的应用：
```js
import { ShadowFunction, ShadowDocument } from 'shadow-function'
new ShadowFunction('console.log(a + b)')({a: 1, b: 2, console})  // 3
let sDoc = new ShadowDocument(document.body, '<div>123</div>')
sDoc(`
  document.body.append($template.content);
  console.log(document.body.getElementsByTagName("div")[0].innerText)
`)({console})
```
类型鉴权配置：
```js
let shadowFunction 
shadowFunction = new ShadowFunction({    
Node: [      
  'nodeName',      
  'nodeType',      
  'textContent'    
 ],    
 Element: [      
   'style',      
   'onblur',      
   'onfocus',      
   'onscroll',      
   'offsetWidth',      
   'offsetHeight',      
   'clientWidth',      
   'clientHeight',      
   'innerText',      
   'setAttribute',      
   'removeAttribute',      
   'createTextNode',      
   'addEventListener',      
   'getElementsByTagName'    
 ],   
 HTMLDivElement: []
})
shadowFunction(`
  document.appendChild(document.createElement("div"))
`)({document})
```
Proto 等限制
```js
new ShadowFunction('console.log(a.prototype)')({console, a: {}}) // undefined
new ShadowFunction('console.log(a.valueOf.__proto__)')({console, a: {}}) // undefined
```
