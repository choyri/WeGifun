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
}

pageParams.bindNavigator = function (e) {
  const { url, type } = e.currentTarget.dataset

  if (type && !wx.ooService.user.isBind(type)) {
    wx.ooShowToast({ title: this.data._string.bind })
    return
  }

  wx.navigateTo({ url })
}

Page(pageParams)
