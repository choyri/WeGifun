let pageParams = {
  data: {
    changelog: wx.ooString.changelog,
    qqGroup: wx.ooConfig.qqGroup,
    version: wx.ooConfig.version,
    _string: wx.ooString.common_about,
  },
  _tmp: {
    devClickCount: 0,
    debugClickCount: 0,
    eggClickCount: 0,
  },
}

pageParams.onReady = function () {
  wx.ooSetTitle(this.data._string.title)
}

pageParams.onPageScroll = function (e) {
  const { scrollTop } = e

  // 125 是头图的高度 # px
  let showPageShadow = scrollTop > 125 ? true : false

  if (showPageShadow !== this.data.showPageShadow) {
    this.setData({ showPageShadow })
  }
}

pageParams.bindCopy = function (e) {
  wx.setClipboardData({
    data: e.currentTarget.dataset.text || '',
  })
}

pageParams.bindDebug = function () {
  if (++this._tmp.debugClickCount < 7) {
    return
  }

  if (this._tmp.debugClickCount === 7) {
    this._tmp.debugClickCount = 0
    const enableDebug = !wx.ooCache.enableDebug
    wx.setEnableDebug({ enableDebug })
    wx.ooSaveData({ enableDebug })
  }
}

pageParams.bindDev = function () {
  if (++this._tmp.devClickCount < 7) {
    return
  }

  if (this._tmp.devClickCount === 7) {
    this._tmp.devClickCount = 0
    const dev = !wx.ooCache.dev
    wx.ooSaveData({ dev })
    wx.ooShowToast({ title: `${wx.ooString.global.dev} ${dev}` })
    wx.vibrateLong()
  }
}

pageParams.bindEgg = function () {
  if (++this._tmp.eggClickCount < 5) {
    wx.vibrateShort()
    return
  }

  if (this._tmp.eggClickCount === 5) {
    wx.vibrateLong()
    this.setData({ showEgg: true })
  }
}

pageParams.bindReward = function () {
  wx.previewImage({
    urls: [wx.ooConfig.rewardCodeImageUrl]
  })
}

Page(pageParams)
