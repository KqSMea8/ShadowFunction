'use strict'

const object2params = (obj) => {
  let url = ''
  Object.entries(obj).forEach((v) => {
    if (typeof (v[1]) === 'object') v[1] = JSON.stringify(v[1])
    url += v.join('=') + '&'
  })

  return url.substring(0, url.length - 1)
}

export {
  object2params
}
