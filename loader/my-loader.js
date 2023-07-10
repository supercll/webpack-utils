const { getOptions } = require('loader-utils')
module.exports = function(content, map, meta) {
  const callback = this.async() // 异步loader

  const options = getOptions(this) // 参数

  setTimeout(() => {
    console.log('my-loader', content, options)
    callback(null, content)
  }, 1000)
}