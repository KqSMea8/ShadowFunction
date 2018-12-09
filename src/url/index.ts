// const object2params = (obj) => {
//   let url = ''
//     ; (function (obj) {
//       let kvArr = Object.entries(obj)
//       kvArr.forEach(v => {
//         if (Object.prototype.toString.call(v[1]) == '[object Object]') {
//           arguments.callee(v[1])
//         } else {
//           url += v.join('=') + '&'
//         }
//       })
//     })(obj)

//   return url.substring(0, url.length - 1)
// }

// export { object2params }

const object2params = (obj) => {
  let url = ''
  ;(function (obj) {
    let kvArr = Object.entries(obj)
    kvArr.forEach(function handle ([key, value]) {
      if (Object.prototype.toString.call(value) === '[object Object]') {
        // arguments.callee(value)
        handle(value as [string, {}])
      } else {
        url += `${key}=${value}&`
      }
    })
  })(obj)

  return url.substring(0, url.length - 1)
}

export { object2params }
