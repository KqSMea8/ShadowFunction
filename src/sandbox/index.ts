'use strict'

class Sandbox {
  public shadowWindow: any = {}
  public window: Window
  public document: Document
  private sandbox: HTMLIFrameElement
  private content: Document

  constructor (white?: boolean) {
    const sandbox = this.sandbox = document.createElement('iframe')
    const documentElement = document.documentElement as HTMLHtmlElement
    sandbox.src = 'about:blank'
    sandbox.setAttribute('sandbox', 'allow-scripts allow-same-origin')
    sandbox.style.display = 'none'
    documentElement.appendChild(sandbox)

    const contentWindow = this.sandbox.contentWindow as Window
    const contentDocument = this.sandbox.contentDocument as Document
    this.window = contentWindow
    this.content = this.document = contentDocument
    this.open().write('').close()
    this.window = contentWindow.window

    const windowProperty = Object.getOwnPropertyNames(this.window)

    // @ts-ignore
    this.shadowWindow = new contentWindow.Object
    for (let k of windowProperty) {
      this.shadowWindow[k] = this.window[k]
    }

    this.shadowWindow.shadowWindow = this.shadowWindow
    if (!white) this.exit()

    return this
  }

  open () {
    this.content.open()
    return this
  }

  write (head: string, body?: string, context?: string) {
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
    const parentNode = this.sandbox.parentNode as HTMLHtmlElement
    parentNode && parentNode.removeChild(this.sandbox)
  }
}

export {
  Sandbox
}
