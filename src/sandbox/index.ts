'use strict'

class Sandbox {
  public window!: Window
  private sandbox: HTMLIFrameElement
  // private iframe: HTMLIFrameElement
  private content: Document
  // private document!: Document

  constructor (white?) {
    const sandbox = this.sandbox /* = this.iframe */ = document.createElement('iframe')
    sandbox.setAttribute('sandbox', 'allow-scripts allow-same-origin')

    sandbox.style.display = 'none'
    ;(document.documentElement as HTMLHtmlElement).appendChild(sandbox)

    this.content = this.sandbox.contentDocument as Document
    this.open().write('').close().init()

    if (!white) {
      this.exit()
    }

    return this
  }

  init () {
    const contentWindow = this.sandbox.contentWindow as Window
    this.window = contentWindow.window
    // this.document = contentWindow.document
    return this
  }

  open () {
    this.content.open()
    return this
  }

  write (head, body?, context?) {
    if (head || body) {
      context = '<!DOCTYPE html>' +
        '<html>' +
        '<head>' +
        (head || '') +
        '</head>' +
        '<body>' +
        (body || '') +
        '</body>' +
        '</html>'
    } else {
      context = '<head><meta charset="utf-8"></head>'
    }
    this.content.write(context)
    return this
  }

  close () {
    this.content.close()
    return this
  }

  exit () {
    this.sandbox.src = 'about:blank'
    let parentNode = this.sandbox.parentNode
    parentNode && parentNode.removeChild(this.sandbox)
  }
}

export {
  Sandbox
}
