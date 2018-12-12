'use strict'

import { getObjectType } from '../objectType/index'
import { Sandbox } from '../sandbox/index'
import { safeEval } from '../safeEval/index'

// ShadowFunction
class ShadowFunction {
  private sandbox = new Sandbox()
  private shadowWindow = this.sandbox.shadowWindow
  private shadowToString = (this.sandbox.shadowWindow as any).Object.toString
  private ShadowFunction = (this.sandbox.shadowWindow as any).Function
  private shadowFunction
  private allowProtoProperties = {
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
  private log
  private tracker = (e: { object: object, name: string, action: string, value?: any}) => {
    if (typeof (e.name) !== 'symbol') {
      if (typeof (this.log) === 'function') {
        this.log(e)
      } else {
        console.log('Event Log:', e)
      }
    }
  }

  constructor (scriptStr: any) {
    switch (typeof (scriptStr)) {
      case 'object':
        // @ts-ignore
        return this.setAllowProtoProperties(scriptStr)
      case 'string':
        // @ts-ignore
        return this.runShadow(scriptStr)
      default:
        throw new Error('Uncaught SyntaxError: Unexpected identifier')
    }
  }

  private event (log: (param: object) => {}) {
    this.log = log
  }

  private getAllowProtoProperties (constructorName: string) {
    const properties = this.allowProtoProperties
    let allowProperties = properties[constructorName]
    if (typeof (allowProperties) === 'function') return allowProperties()
    if (/HTML(\w+)Element/.exec(constructorName)) {
      allowProperties = allowProperties.concat(properties['HTMLElement'], properties['Element'], properties['Node'])
    }
    return allowProperties
  }

  private setAllowProtoProperties (allowProperties: object) {
    Object.assign(this.allowProtoProperties, allowProperties)
    return this.runShadow.bind(this)
  }

  private proxy (object: object, origin: object) {
    const safeSetter = this.safeSetter.bind(this)
    const safeGetter = this.safeGetter.bind(this)
    let propNames = Object.getOwnPropertyNames(object)
    let Proxy = this.shadowWindow.Proxy
    return new Proxy(safeEval(`({${propNames.length ? propNames.join(':{},') + ':{}' : ''}})`), {
      get (_target, name) {
        return safeGetter(object, name)
      },
      set: (_target, name, value) => {
        return safeSetter(origin, name, value)
      }
    })
  }

  private checkIsSmuggled (object: object) {
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

  private proxyObject (target: object, name: string, value: any) {
    if (getObjectType(value) !== 'Object' && value.toString.constructor === this.shadowToString.constructor) {
      if (!this.checkIsSmuggled(value)) {
        target[name] = value
      } else {
        throw new Error('Uncaught SyntaxError: Do not enclose custom functions in Element')
      }
    } else {
      target[name] = this.proxyEach(value)
    }
  }

  private proxyEach (object: object) {
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

  private safeSetter (object: object, name: string, value: any) {
    let valueType = typeof(value)
    let prototype = getObjectType(object)
    let propNames = Object.getOwnPropertyNames(object)
    let whitelist = this.allowProtoProperties[prototype]

    if (whitelist) {
      propNames = propNames.concat(whitelist)
    }

    if (propNames.indexOf(name) === -1) {
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

  private safeGetter (object: object, name: string) {
    let value = object[name]
    let valueType = typeof(value)
    let prototype = getObjectType(object)
    let propNames = Object.getOwnPropertyNames(object)
    let whitelist = this.allowProtoProperties[prototype]

    if (whitelist) {
      propNames = propNames.concat(whitelist)
    }

    if (propNames.indexOf(name) === -1) {
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

  private safeReturnFunction (value: () => {}, object: object) {
    return new this.ShadowFunction('value', 'object', 'safeReturnFunction', 'proxy', `
      return (function () {
        return function () {
          return proxy(value.apply(object, proxy(arguments)))
        }
      })()
    `)(value, object, this.safeReturnFunction, this.proxyEach.bind(this))
  }

  public runShadow (scriptStr: string) {
    this.shadowFunction = new this.ShadowFunction('(function () { with (arguments[0]) { ' + scriptStr + ' } })(this)')
    return this.runScript.bind(this)
  }

  public runScript (that: object, event: (event: object) => {}) {
    let target = this.proxyEach(that)
    let shadowFunction = this.shadowFunction as any
    event && this.event(event)
    shadowFunction.apply(Object.assign(this.shadowWindow, target))

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
