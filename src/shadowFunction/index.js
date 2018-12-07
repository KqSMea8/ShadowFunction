"use strict"

import { getObjectType } from '../objectType/index'
import { Sandbox } from '../sandbox/index'
import { safeEval } from '../safeEval/index'

// ShadowFunction
class ShadowFunction {
  constructor(scriptStr) {
    this.sandbox = new Sandbox()
    this.shadowToString = this.sandbox.window.Object.toString
    this.ShadowFunction = this.sandbox.window.Function
    this.init()

    switch (typeof(scriptStr)) {
      case 'object':
        return this.setAllowProtoProperties(scriptStr)
      case 'string':
        return this.runShadow(scriptStr)
      default:
        throw 'Uncaught SyntaxError: Unexpected identifier'
    }
  }

  init() {
    this.allowProtoProperties = {
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
      HTMLElement: [],
      HTMLBodyElement: [],
      HTMLDivElement: [],
      HTMLUListElement: [],
      HTMLLIElement: [],
      HTMLVideoElement: [],
      HTMLAudioElement: [],
      HTMLSelectElement: [],
      HTMLOptionElement: [],
      HTMLInputElement: [],
      HTMLSpanElement: [],
      HTMLDListElement: [],
      HTMLFontElement: [],
      HTMLHeadingElement: [],
      HTMLParagraphElement: []
    }
    this.tracker = () => {}
  }

  event(tracker) {
    this.tracker = tracker
  }

  getAllowProtoProperties(constructorName) {
    const properties = this.allowProtoProperties
    let allowProperties = properties[constructorName]
    if (typeof(allowProperties) == 'function') return allowProperties()
    if (/HTML(\w+)Element/.exec(constructorName)) {
      allowProperties.concat(properties['HTMLElement'], properties['Element'], properties['Node'])
    }
    return allowProperties
  }

  setAllowProtoProperties(allowProperties) {
    Object.assign(this.allowProtoProperties, allowProperties)
    return this.runShadow.bind(this)
  }

  proxy(object, origin) {
    let propNames = Object.getOwnPropertyNames(object)
    let safeSetter = this.safeSetter.bind(this)
    let safeGetter = this.safeGetter.bind(this)
    let Proxy = safeEval('(Proxy)')
    return new Proxy(safeEval(`({${propNames.length ? propNames.join(':{},') + ':{}' : ''}})`), {
      get (target, name) {
        return safeGetter(object, name)
      },
      set: (target, name, value) => {
        return safeSetter(origin, name, value)
      }
    })
  }

  checkIsSmuggled(object) {
    let propNames = Object.getOwnPropertyNames(object)
    let isSmuggled = false
    for (let name of propNames) {
      let value = object[name]
      let valueType = typeof(value)

      if (value) {
        switch (valueType) {
          case 'object':
            if (this.checkIsSmuggled(value)) {
              isSmuggled = true
            }
            break
          case 'string':
          case 'number':
          case 'boolean':
            break
          case 'function':
            if (value.toString.constructor !== this.shadowToString.constructor) {
              isSmuggled = true
            }
            break
          default:
            isSmuggled = true
            break
        }
      }
    }

    return isSmuggled
  }

  proxyObject(target, name, value) {
    if (getObjectType(value) !== 'Object' && value.toString.constructor === this.shadowToString.constructor) {
      if (!this.checkIsSmuggled(value)) {
        target[name] = value
      } else {
        throw 'Uncaught SyntaxError: Do not enclose custom functions in Element'
      }
    } else {
      target[name] = this.proxyEach(value)
    }
  }

  proxyEach(object) {
    if (!object) return safeEval('(undefined)')
    let target = safeEval('({})')
    let prototype = getObjectType(object)
    let propNames = Object.getOwnPropertyNames(object)
    let whitelist = this.getAllowProtoProperties(prototype)

    if (whitelist) {
      propNames = propNames.concat(whitelist)
    }

    for (let name of propNames) {
      let value = object[name]
      let valueType = typeof(value)

      if (value) {
        switch (valueType) {
          case 'object':
            this.proxyObject(target, name, value)
            break
          case 'function':
            target[name] = value.bind(object)
            break
          case 'string':
          case 'number':
          case 'boolean':
            target[name] = value
            break
          default:
            target[name] = '[unknow type]'
            break
        }
      }
    }

    return this.proxy(target, object)
  }

  safeSetter (object, name, value) {
    let valueType = typeof(value)
    let prototype = getObjectType(object)
    let propNames = Object.getOwnPropertyNames(object)
    let whitelist = this.allowProtoProperties[prototype]

    if (whitelist) {
      propNames = propNames.concat(whitelist)
    }

    if (propNames.indexOf(name) == -1) {
      this.tracker({
        object,
        name,
        action: 'write',
        value
      })
      return
    }

    switch (valueType) {
      case 'string':
      case 'number':
      case 'boolean':
        object[name] = value
        break
      case 'function':
        object[name] = this.safeReturnFunction(value, object)
        break
      default:
        this.tracker({
          object,
          name,
          action: 'write',
          value
        })
        break
    }

    return
  }

  safeGetter (object, name) {
    let value = object[name]
    let valueType = typeof(value)
    let prototype = getObjectType(object)
    let propNames = Object.getOwnPropertyNames(object)
    let whitelist = this.allowProtoProperties[prototype]

    if (whitelist) {
      propNames = propNames.concat(whitelist)
    }

    if (propNames.indexOf(name) == -1) {
      this.tracker({
        object,
        name,
        action: 'read'
      })
      return
    }

    switch (valueType) {
      case 'string':
      case 'number':
      case 'object':
      case 'boolean':
        return value
      case 'function':
        return this.safeReturnFunction(value, object)
      default:
        return
    }
  }

  safeReturnFunction(value, object) {
    return new this.ShadowFunction('value', 'object', 'safeReturnFunction', 'proxy', `
      return (function () {
        return function () {
          return proxy(value.apply(object, proxy(arguments)));
        };
      })();
    `)(value, object, this.safeReturnFunction, this.proxyEach.bind(this))
  }

  runShadow(scriptStr) {
    this.shadowFunction = new this.ShadowFunction('(function(){with(arguments[0]) {' + scriptStr + '}})(this)')
    return this.runScript.bind(this)
  }

  runScript(that, event) {
    let target = this.proxyEach(that)
    event && this.event(event)
    this.shadowFunction.apply(target)
    return {
      run: this.runShadow.bind(this),
      proxy: this.proxyEach.bind(this),
      sandbox: this.sandbox
    }
  }
}

export {
  ShadowFunction
}
