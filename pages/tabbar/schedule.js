let pageParams = {
  data: {
    schedule: wx.ooService.edu.getSchedule(),
    scheduleBg: wx.ooService.edu.getScheduleBg(),
    setting: wx.ooCache.setting,
  },
}

pageParams.onLoad = function () {
  wx.ooEvent.on('logout', this.recovery, this)
  wx.ooEvent.on('updateSetting', this.setSetting, this)
  wx.ooEvent.on('updateSchedule', this.setSchedule, this)
  wx.ooEvent.on('updateScheduleBg', this.setScheduleBg, this)
}

pageParams.onReady = function () {
  wx.ooSetTitle(wx.ooString.global.title)

  wx.ooService.edu.updateSchedule()
}

pageParams.onShow = function () {
  if (wx.ooCache.updateFeatureFinished) {
    wx.ooTip.schedule()
  }
}

pageParams.recovery = function () {
  this.setSetting(wx.ooCache.setting)
  this.setSchedule(null)
  this.setScheduleBg(null)
}

pageParams.setSchedule = function (schedule) {
  this.setData({ schedule })
}

pageParams.setScheduleBg = function (scheduleBg) {
  this.setData({ scheduleBg })
}

pageParams.setSetting = function (setting) {
  this.setData({ setting })
}

Page(pageParams)
