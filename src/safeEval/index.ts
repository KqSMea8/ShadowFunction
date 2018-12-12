'use strict'

import { Sandbox } from '../sandbox/index'

// snadbox && shadowSandbox
const shadowSandbox = new Sandbox()
const shadowWindow = shadowSandbox.shadowWindow as any
const safeEval = shadowWindow.eval

export {
  safeEval
}
