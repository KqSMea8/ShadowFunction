const getObjectType = (object) => {
  let objectStr = Object.prototype.toString.call(object)
  let objectType = (/\s*\[(\w+) (\w+)\]\s*/.exec(objectStr) || [])

  switch (objectType[1]) {
    case 'object':
      return objectType[2]
    case 'native':
      return 'native'
  }

  return 'unknow'
}

export { getObjectType }