'use strict'

import { freeze } from '../freeze/index'
let LOCKABLE = true

class Strongbox {
  public password = this.randPassword()
  constructor (insurance: [object]) {
    let secretKey = this.password
    if (!LOCKABLE) throw new Error('Uncaught SyntaxError: Identifier \'Strongbox\' has already been declared')
    // important
    LOCKABLE = false
    for (let insured of insurance) {
      let object = insured[0]
      let props = insured[1]
      let value = object[props]
      Object.defineProperty(object, props, {
        get: function () {
          return (password, setValue) => {
            if (password === secretKey) {
              if (setValue) {
                value = setValue
              } else {
                return value
              }
            } else {
              return
            }
          }
        },
        set () { return },
        enumerable: true,
        configurable: false
      })
      freeze(object, true)
    }

    return this
  }
  private randPassword () {
    let text = ['abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ','1234567890','~!@#$%^&*()_+";",./?<>']
    let rand = (min, max) => { return Math.floor(Math.max(min, Math.random() * (max + 1))) }
    let len = rand(8, 16)
    let pw = ''
    for (let i = 0; i < len; ++i) {
      let strpos = rand(0, 3)
      pw += text[strpos].charAt(rand(0, text[strpos].length))
    }
    return pw
  }
}

export {
  Strongbox
}
