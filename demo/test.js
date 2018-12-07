import { ShadowFunction } from '../src/shadowFunction/index'
import { ShadowDocument } from '../src/shadowDocument/index'
import { ShadowPreact } from '../src/shadowPreact/index'
import { jsonp } from '../src/jsonp/index'
import { csp } from '../src/csp/index'
import { safeEval } from '../src/safeEval/index'
import { WorkerFunction } from '../src/workerFunction/index'

// test
window.seval = safeEval
window.ShadowFunction = ShadowFunction
window.WorkerFunction = WorkerFunction
window.ShadowDocument = ShadowDocument
window.ShadowPreact = ShadowPreact

// csp("script-src 'self'; object-src 'none'; style-src cdn.example.org third-party.org; child-src https:; report-uri https://www.alibaba-inc.com/xss")
// // 移除无效
// let meta = document.getElementsByTagName('meta')
// meta = meta[meta.length -1]
// meta.parentElement.removeChild(meta)


jsonp({
  url: "http://suggest.taobao.com/sug?code=utf-8&q=iphoneX"
}).then((data) => {
  console.log("jsonp:", data)
})


// new ShadowFunction(`
//     fn({
//       callback: function (k) {
//         console.log(arguments.callee)
//         k.valueOf.__proto__.constructor('alert(99)')()
//       }
//     })
// `)({
//   console,
//   fn: function (cb) {
//     cb.callback({k: 7})
//   }
// })