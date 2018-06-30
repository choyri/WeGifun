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
    wx.ooCache[key] = wx.getStorageSync(key)
  }

  console.info('缓存', wx.ooCache)

  // 先检查更新
  this.checkUpdate()

  this.checkSoter()

  this.getNotice()
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
  if (wx.ooCache.supportSoter) {
    return
  }

  let flag = false

  try {
    if (wx.ooCache.systemInfo.model !== 'iPhone X') {
      const res = await wx.ooIsSoterEnrolled()
      flag = res.isEnrolled
    }
  } catch (e) {
    console.log('checkSoter 出现异常 可能当前是开发者工具', e)
    return
  }

  wx.ooSaveData({ supportSoter: flag })
}

appParams.getNotice = async function () {
  wx.ooCache.notice = await wx.ooRequest.getNotice()
}

App(appParams)
