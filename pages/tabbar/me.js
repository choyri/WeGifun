let pageParams = {
  data: {
    canUseOpenData: wx.canIUse('open-data.type.userAvatarUrl'),
    uid: wx.ooService.user.getUid(),
    _string: wx.ooString.tabbar_me,
  },
}

pageParams.onLoad = function () {
  wx.ooEvent.on('bindSuccess', this.setUid, this)
  wx.ooEvent.on('logout', this.setUid, this)
}

pageParams.onReady = function () {
  wx.ooSetTitle(wx.ooString.global.title)
}

pageParams.onShareAppMessage = function () {
  return {
    title: wx.ooConfig.shareTitle[Math.floor(Math.random() * wx.ooConfig.shareTitle.length)],
    path: '/pages/tabbar/schedule',
    imageUrl: wx.ooConfig.shareImageUrl,
  }
}

pageParams.setUid = function () {
  this.setData({ uid: wx.ooService.user.getUid() })
}

Page(pageParams)
