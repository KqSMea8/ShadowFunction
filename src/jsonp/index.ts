'use strict'

import { Sandbox } from '../sandbox/index'
import { TryAgain } from '../try-again/index'
import { object2params } from '../url/index'

// callback 自增 id
let JSONP_AUTO_INCREMENT_ID = 0

const sandbox = new Sandbox(true)
const sandboxWindow = sandbox.window
const sandboxDocument = sandboxWindow.document

const jsonp = function (options) {
  return new Promise(function (resolve, reject) {
    let { url, data, callbackKey, callbackName, timeout } = options
    let script
    let tryObj
    let payload = ''
    let timeoutId
    data = data || {}
    timeout = timeout || 30000
    callbackKey = callbackKey || 'callback'
    callbackName = callbackName || '__call__' + (++JSONP_AUTO_INCREMENT_ID)
    data[callbackKey] = callbackName
    sandboxWindow[callbackName] = (data) => {
      delete sandboxWindow[callbackName]
      if (Object.prototype.toString.call(data) === '[object Object]') {
        resolve(data)
      } else {
        reject()
      }
    }
    payload = object2params(data)

    if (!url || typeof url !== 'string') return reject('params url is not defined')
    url += (url.indexOf('?') !== -1 ? '&' : '?') + payload

    // 异常尝试
    tryObj = new TryAgain(send, { timeout: 3000, polls: 2 })

    // abort
    function abort () {
      clearTimeout(timeoutId)
      window.removeEventListener('online', send, false)
      try {
        (sandboxDocument.documentElement as HTMLHtmlElement).removeChild(script)
      } catch (e) {
        //
      }
    }

    // 错误处理
    function over () {
      abort()
      tryObj.try()
      if (tryObj.polls === 0) {
        reject()
      }
    }

    function send () {
      script = sandboxDocument.createElement('SCRIPT')
      script.charset = 'utf-8'
      script.src = url

      // failed
      script.onerror = over
      script.onload = () => {
        abort()
        tryObj.over()
      }

      (sandboxDocument.documentElement as HTMLHtmlElement).appendChild(script)
    }
    timeoutId = setTimeout(over, timeout)
    send()

    // 断网重连
    if (navigator.onLine === false) {
      tryObj.stop()
      window.addEventListener('online', send, false)
    }
  })
}
export {
  jsonp
}
