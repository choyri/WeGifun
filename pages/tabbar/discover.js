import regeneratorRuntime from '../../utils/libs/regenerator-runtime'

let pageParams = {
  data: {
    _string: Object.assign({},
      wx.ooString.services,
      wx.ooString.tabbar_discover,
    ),
  },
}

pageParams.onReady = function () {
  wx.ooSetTitle(wx.ooString.global.title)

  this.setData({
    notice: wx.ooCache.notice || null,
  })
}

pageParams.bindNavigator = function (e) {
  let { url, type, src } = e.currentTarget.dataset

  if (type && !wx.ooService.user.isBind(type)) {
    wx.ooShowToast({ title: this.data._string.bind })
    return
  }

  if (src) {
    url += `?src=${src}`
  }

  wx.navigateTo({ url })
}

Page(pageParams)
