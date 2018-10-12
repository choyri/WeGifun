import regeneratorRuntime from './utils/libs/regenerator-runtime'

import config from './config';
import './utils/init'

let appParams = {}

appParams.onLaunch = function (options) {
  if (options.query && options.query.dev) {
    console.log('真机预览模式')
    wx.ooCache.dev = true
  }

  for (const key of wx.getStorageInfoSync().keys) {
    const data = wx.getStorageSync(key)
    wx.ooCache[key] = !wx.ooUtil.isObject(data) ? data : Object.assign({}, wx.ooCache[key] || {}, data)
  }

  console.info('缓存', wx.ooCache)

  // 先检查更新
  this.checkUpdate()

  this.checkSoter()

  this.getNotice()

  this.wechatLogin()
}

appParams.onError = function (error)  {
  // 过滤奇怪的错误
  if (error.indexOf('webview') !== -1 || error.indexOf('appServiceSDKScriptError') !== -1) {
    return
  }

  let content = [
    `用户：${wx.ooCache.user && wx.ooCache.user.id} / ${wx.ooCache.openID}`,
    `版本：${wx.ooCache.version}`,
    `系统信息：${JSON.stringify(wx.ooCache.systemInfo)}`,
    `错误堆栈：${error}`,
  ]

  if (error.indexOf('schedule') !== -1) {
    content.push(`课程信息：${JSON.stringify(wx.ooCache.schedule)}`)
  }

  if (error.indexOf('split') !== -1) {
    content.push(`教务数据：${JSON.stringify(wx.ooCache.edu)}`)
  }

  wx.ooRequest.triggerAlarm(content.join('\n\n'))
}

appParams.checkUpdate = function () {
  // 基础库 1.9.90 开始支持
  if (wx.getUpdateManager) {
    const updateManager = wx.getUpdateManager()

    updateManager.onUpdateReady(async function () {
      const modalRes = await wx.ooShowModal({ content: wx.ooString.global.updateManager })

      if (modalRes.confirm) {
        updateManager.applyUpdate()
      }
    })
  }

  if (wx.ooCache.version === config.version) {
    return
  }

  console.log('已更新到新版', config.version)

  // 新用户不显示新版特性 因此先判断缓存里是否存在版本项
  if (wx.ooCache.version && wx.ooString.feature) {
    wx.ooShowModal({
      title: wx.ooString.global.new_feature,
      content: wx.ooString.feature,
    }, false)
  }

  wx.ooSaveData({ version: config.version })
}

appParams.checkSoter = async function () {
  if (wx.ooCache.supportSoter !== undefined) {
    return
  }

  let flag = false

  if (wx.ooCache.systemInfo.model.toLowerCase().indexOf('iphone x') === -1) {
    const ret = await wx.ooIsSoterEnrolled().catch(ret => ret)
    flag = ret.isEnrolled || false
  }

  wx.ooSaveData({ supportSoter: flag })
}

appParams.getNotice = async function () {
  wx.ooCache.notice = await wx.ooRequest.getNotice()
}

appParams.wechatLogin = async function () {
  const user = wx.ooService.user.getAccount()

  if (!user.id || wx.ooCache.openID) {
    return
  }

  const loginRet = await wx.ooPro.login()

  const openID = await wx.ooRequest.wechatLogin([loginRet.code, user.id])
  wx.ooSaveData({ openID })
}

App(appParams)
