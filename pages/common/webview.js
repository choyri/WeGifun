let pageParams = {}

pageParams.onLoad = function (options) {
  this.setData({
    src: options.src || '',
  })
}

Page(pageParams)
