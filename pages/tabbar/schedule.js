import regeneratorRuntime from '../../utils/libs/regenerator-runtime'
import Promise from '../../utils/libs/es6-promise'

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

pageParams.onReady = async function () {
  wx.ooSetTitle(wx.ooString.global.title)

  // 等待应用完全启动
  await this.waitLaunched()

  if (wx.ooService.edu.getSchedule() !== null) {
    wx.ooTip.schedule()
  }

  // 如果是程序升级 强制刷新课表
  const shouldForce = wx.ooCache.updateSucceed || false
  wx.ooService.edu.updateSchedule(shouldForce)
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

pageParams.waitLaunched = async function () {
  await wx.ooSleep(300)

  if (wx.ooCache.launched) {
    return Promise.resolve()
  }

  return await this.waitLaunched()
}

Page(pageParams)
