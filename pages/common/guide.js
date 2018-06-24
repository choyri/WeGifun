let pageParams = {
  data: {
    _string: wx.ooString.common_guide,
  },
}

pageParams.onReady = function () {
  wx.ooSetTitle(this.data._string.title)
}

Page(pageParams)
