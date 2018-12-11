'use strict'

const getObjectType = (object: any): string => {
  const objectStr = Object.prototype.toString.call(object)
  const objectType = (/\s*\[(\w+) (\w+)\]\s*/.exec(objectStr) || [])

  switch (objectType[1]) {
    case 'object':
      return objectType[2]
    case 'native':
      return 'native'
  }

  return 'unknow'
}

export {
  getObjectType
}
