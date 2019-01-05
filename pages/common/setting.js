import regeneratorRuntime from '../../utils/libs/regenerator-runtime'

let pageParams = {
  data: {
    setting: wx.ooCache.setting,
    scheduleBg: wx.ooService.edu.getScheduleBg(),
    _string: wx.ooString.common_setting,
  },
  _tmp: {},
}

pageParams.onLoad = function () {
  this._ooSetData({
    isLogin: wx.ooService.user.isLogin(),
  })
}

pageParams.onReady = function () {
  wx.ooSetTitle(this.data._string.title)
}

pageParams.onUnload = function () {
  if (!this._tmp.logout && this.data.setting.showScheduleBg && !wx.ooService.edu.getScheduleBg().path) {
    this._ooSetData({ 'setting.showScheduleBg': false })
    this._updateSetting('showScheduleBg', false)
    wx.ooShowToast({ title: this.data._string.schedule_bg_exit })
  }
}

pageParams.bindLogout = async function () {
  const modalRes = await wx.ooShowModal({ content: this.data._string.logout_tip })

  if (modalRes.confirm) {
    this._tmp.logout = true
    wx.ooLogout()
    wx.navigateBack()
  }
}

pageParams.bindSetLanguage = async function () {
  const ret = await wx.ooPro.showActionSheet({ itemList: this.data._string.language_list })
  const index = ret.tapIndex

  this._ooSetData({ 'setting.languageIndex': index })
  this._updateSetting('languageIndex', index)

  wx.ooShowModal({ content: this.data._string.language_tip }, false)
}

pageParams.bindSetScheduleBg = async function (e) {
  const oldFilePath = this.data.scheduleBg.path

  let res = await wx.ooPro.chooseImage({ count: 1 })
  res = await wx.ooPro.saveFile({ tempFilePath: res.tempFilePaths[0] })

  this._ooSetData({ 'scheduleBg.path': res.savedFilePath })
  wx.ooService.edu.saveScheduleBg({ path: res.savedFilePath })

  wx.removeSavedFile({ filePath: oldFilePath })
}

pageParams.bindSetScheduleBgStyle = async function () {
  const res = await wx.ooPro.showActionSheet({ itemList: this.data._string.schedule_bg_style })

  this._ooSetData({ 'scheduleBg.style': res.tapIndex })
  wx.ooService.edu.saveScheduleBg({ style: res.tapIndex })
}

pageParams.bindSwitchScheduleBg = function (e) {
  const value = e.detail.value

  this._ooSetData({ 'setting.showScheduleBg': value })
  this._updateSetting('showScheduleBg', value)
}

pageParams.bindSwitchScheduleDate = function (e) {
  const value = e.detail.value

  this._ooSetData({ 'setting.showScheduleDate': value })
  this._updateSetting('showScheduleDate', value)
}

pageParams.bindSwitchScheduleHideCourse = function (e) {
  const value = e.detail.value

  this._ooSetData({ 'setting.hideCourse': value })
  this._updateSetting('hideCourse', value)

  wx.ooService.edu.updateSchedule(true)
}

pageParams.bindSwitchScheduleLightUp = function (e) {
  const value = e.detail.value

  this._ooSetData({ 'setting.lightUpSchedule': value })
  this._updateSetting('lightUpSchedule', value)

  wx.ooService.edu.updateSchedule(true)
}

pageParams._ooSetData = function (obj) {
  for (let key in obj) {
    // 同步更改 pageParams 里对应的值 这样重新打开本页时就可以保持最新状态
    wx.ooObjectPath.set(pageParams, `data.${key}`, obj[key])

    this.setData({ [key]: obj[key] })
  }
}

pageParams._updateSetting = function (key, value) {
  wx.ooSaveData({ setting: { [key]: value } })
  wx.ooEvent.emit('updateSetting', wx.ooCache.setting)
}

Page(pageParams)
