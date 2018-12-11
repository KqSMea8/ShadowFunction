'use strict'

import { ShadowFunction } from '../shadowFunction/index'

const DOCUMENT = document

// ShadowDocument
class ShadowDocument {
  private TREE
  private o: number = 0
  private sandbox
  private shadowFunction
  private allowTagName = {
    'DIV': true,
    'B': true,
    'P': true,
    'DL': true,
    'DT': true,
    'DD': true,
    'EM': true,
    'HR': true,
    'UL': true,
    'LI': true,
    'OL': true,
    'TD': true,
    'TH': true,
    'TR': true,
    'TT': true,
    'NAV': true,
    'SUP': true,
    'SUB': true,
    'SPAN': true,
    'FONT': true,
    'STYLE': true,
    'SMALL': true,
    'LABEL': true,
    'INPUT': true,
    'TABLE': true,
    'TBODY': true,
    'THEAD': true,
    'TFOOT': true,
    'BUTTON': true,
    'FOOTER': true,
    'HEADER': true,
    'STRONG': true
  }

  constructor (root: any, template: string, setting: object) {
    this.TREE = {
      0: root.attachShadow ? root.attachShadow({ mode: 'open' }) : root
    }
    Object.assign(this.allowTagName, setting)
    this.shadowFunction = new ShadowFunction({})
    this.shadowFunction = this.shadowFunction(this.reject(template))({
      __$template__: template
    })
    this.sandbox = this.shadowFunction.sandbox
    this.parallel(this.sandbox.document)

    // @ts-ignore
    return this.shadowFunction.run.bind(this)
  }

  private reject (template) {
    let reject = `
      (function () {
        var __$getEventTarget__ = function (object) {
          if (!object) return
          if ((object.__proto__ + '').indexOf('EventTarget') !== -1) {
            return object.__proto__
          } else {
            return __$getEventTarget__(object.__proto__)
          }
        }
        var __$EventTarget__ = __$getEventTarget__(window)
        __$EventTarget__.addEventListener = function (name, fn, opt) {
          let props = 'on-' + name
          this.setAttribute(props, name)
          if (this[props]) {
            this[props].push(fn)
          } else {
            this[props] = [fn]
          }
        }
        __$EventTarget__.removeEventListener = function (name, fn, opt) {
          let props = 'on-' + name
          this.removeAttribute(props)
          if (!this[props]) return
          let index = this[props].indexOf(fn)
          if (index !== -1) {
            this[props].splice(index, 1)
          }
        }
      })();
      window['$template'] = document.createElement('template');
    `

    return reject + 'window[\'$template\'].innerHTML = \'' + template + '\';'
  }

  private uuid (node: any, uuid?) {
    uuid = parseInt(node.parentNode ? node.parentNode.uuid || 0 : 0, 10)
    uuid++
    this.o++
    uuid = uuid + '.' + this.o
    if (!node.uuid) node.uuid = uuid
    return uuid
  }

  private iterator (nodes: any) {
    if (nodes.nextNode) return nodes
    return DOCUMENT.createNodeIterator(nodes, NodeFilter.SHOW_ALL, null)
  }

  private walker (nodes: any, target: any, del = false) {
    let node = nodes.nextNode()
    while (node) {
      node = nodes.nextNode()
      if (!node) break
      if (node.uuid) continue
      this.uuid(node)
      switch (node.nodeType) {
        case Node.ELEMENT_NODE:
          if (del) {
            this.removeElement(node, target)
          } else {
            this.createElement(node, target)
            for (let i = 0; i < node.attributes.length; i++) {
              this.setAttribute(node.attributes[i].name, node)
            }
          }
          break
        case Node.TEXT_NODE:
          if (del) {
            this.removeTextNode(node, target)
          } else {
            this.createTextNode(node, target)
          }
          break
      }
    }
  }

  private getParentId (node: any, target: any) {
    return (node.parentNode ? node.parentNode.uuid : target.uuid) || 0
  }

  private createElement (node: any, target: any) {
    let name = node.nodeName
    let uuid = node.uuid
    let puuid = this.getParentId(node, target)

    switch (name) {
      case this.allowTagName[name] ? name : null:
        this.TREE[uuid] = DOCUMENT.createElement(name)
        break
      default:
        throw new Error(`The tag name provided ('${name}') is not a valid name.`)
    }

    this.TREE[puuid].appendChild(this.TREE[uuid])
  }

  private removeElement (node: any, target: any) {
    let uuid = node.uuid
    let puuid = this.getParentId(node, target)

    if (this.TREE[puuid] && this.TREE[uuid]) {
      this.TREE[puuid].removeChild(this.TREE[uuid])
      delete this.TREE[uuid]
    }
  }

  private createTextNode (node: any, target: any) {
    let uuid = node.uuid
    let puuid = this.getParentId(node, target)
    let text = node.textContent

    this.TREE[uuid] = DOCUMENT.createTextNode(text)
    if (this.TREE[puuid]) {
      this.TREE[puuid].appendChild(this.TREE[uuid])
    }
  }

  private removeTextNode (node: any, target: any) {
    let uuid = node.uuid
    let puuid = this.getParentId(node, target)

    if (this.TREE[puuid] && this.TREE[uuid]) {
      this.TREE[puuid].removeChild(this.TREE[uuid])
      delete this.TREE[uuid]
    }
  }

  private setAttribute (name: string, node: any) {
    let attri = this.TREE[node.uuid]
    let allow = this.allowTagName[node.tagName]
    let value = node.getAttribute(name)

    switch (name) {
      case 'on-click':
      case 'on-touchstart':
      case 'on-touchmove':
      case 'on-touchend':
      case 'on-focus':
      case 'on-mouseover':
      case 'on-mouseout':
      case 'on-mousedown':
      case 'on-mouseup':
      case 'on-mousemove':
      case 'on-change':
      case 'on-select':
      case 'on-keypress':
      case 'on-keydown':
      case 'on-keyup':
      case 'on-submit':
      case 'on-reset':
        if (node.hasEventListener) return
        node.hasEventListener = true
        attri.addEventListener(value, (e) => {
          this.shadowFunction.run(`
            for (let i = 0; i < event.length; i++) {
              let even = event[i]
              typeof(even) === 'function' && even.call(node, e)
            }
          `)({ event: node[name], node, e: this.shadowEvent(e) })
        }, false)
        return
    }

    if (typeof(allow) === 'function') {
      if (!allow(name, value)) {
        return
      }
    }

    if (attri) {
      attri.setAttribute(name, value)
    }
  }

  private setCharacterData (node: any) {
    let char = this.TREE[node.uuid]
    if (char) char.textContent = node.textContent
  }

  private shadowEvent (e: object) {
    let event = {}
    for (let k in e) {
      switch (typeof (e[k])) {
        case 'string':
        case 'number':
        case 'boolean':
          event[k] = e[k]
          break
      }
    }
    return event
  }

  private parallel (root: HTMLElement) {
    this.shadowFunction.run('observer()')({ observer: () => {
      new MutationObserver((records) => {
        for (let record of records) {
          let target = record.target
          switch (record.type) {
            case 'attributes':
              // @ts-ignore
              this.setAttribute(record.attributeName, target)
              break
            case 'characterData':
              this.setCharacterData(target)
              break
            case 'childList':
              // @ts-ignore
              for (let node of record.addedNodes) {
                this.walker(this.iterator(node), target)
              }
              // @ts-ignore
              for (let node of record.removedNodes) {
                this.walker(this.iterator(node), target, true)
              }
              break
          }
        }
      }).observe(root, {
        subtree: true,
        attributes: true,
        childList: true,
        characterData: true,
        attributeOldValue: true,
        characterDataOldValue: true
      })
    } })
  }
}

export {
  ShadowDocument
}
