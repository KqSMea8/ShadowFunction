import { ShadowFunction, ShadowDocument, ShadowPreact, WorkerFunction, Strongbox, safeEval, jsonp, csp } from '../src/index'


// test
window.seval = safeEval
window.ShadowFunction = ShadowFunction
window.WorkerFunction = WorkerFunction
window.ShadowDocument = ShadowDocument
window.ShadowPreact = ShadowPreact
window.Strongbox = Strongbox

// 第三层防护： Content Security Policy Demo
// csp("object-src 'none'; style-src cdn.example.org third-party.org; child-src https:; report-uri https://www.alibaba-inc.com/xss")
// 移除无效
// let meta = document.getElementsByTagName('meta')
// meta = meta[meta.length -1]
// meta.parentElement.removeChild(meta)

// 获取jsonp
// jsonp({
//   url: "http://suggest.taobao.com/sug?code=utf-8&q=iphoneX"
// }).then((data) => {
//   console.log("jsonp:", data)
// })

// 传入安全测试 会报错
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

// 第一层防护
// 攻防测试
new ShadowFunction(`
    console.log(k, 'ISV 代码测试写在这')
    console.log('test:', j.toString)

    // ISV 代码测试写在这
    // ISV 代码测试写在这
    // ISV 代码测试写在这
`)({
  console,
  k: 11111,
  j: {
    q: 123,
    d: 456
  }
})

// 第二层防护，理论上用不到才对
;(function () {
  let gg = new Strongbox([[document, 'cookie']])
  let cookie = document.cookie(gg.password)

  console.log('使用闭包密码' + gg.password + '拿到 cookie:' + cookie)
})()

// preact 测试
new ShadowPreact(`
  document.body.append($template.content);
  let ccc = preact.createElement(
    "button",
    {
      onClick: function (e) {
        alert("hi!");
        console.log(ccc, 999)
      }
    },
    "Click Me"
  )
  function rrr (width) {
    preact.render(preact.createElement(
      "div",
      { id: "foo" },
      preact.createElement(
        "img",
        {
          src: "https://wx1.sinaimg.cn/thumb180/00668JlNly1fwv2e16ez3j30k0140q6d.jpg",
          width: width,
          onClick: function (e) {
            alert(123)
            console.log(this)
          }
        }
      ),
      ccc
    ), document.getElementById('app'));
  }
  let i = 1
  rrr(400 * i)

  /* 性能测试 */
  // setInterval(() => {
    // rrr(400 * i)
    // i++
    // if (i > 100) i =1
  // }, 0)
  console.log(document.getElementById('app'))
`, { // DOM 节点设置
  'DIV': true,
  'P': true,
  'BUTTON': true,
  'IMG': function (name, value) {
    if (name === 'src' && value === 'https://wx1.sinaimg.cn/thumb180/00668JlNly1fwv2e16ez3j30k0140q6d.jpg') {
      return true
    }
  }
})({console, alert: function (str) {alert('eeee' + str)}, setInterval: function (fn, t) {console.log(t);setInterval(function () {fn();}, t)}})

