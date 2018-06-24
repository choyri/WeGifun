import api from './api'
import config from '../config';
import event from './event'
import locales from './locales/index'
import objectPath from './libs/object-path'
import request from './request'
import tip from './tip'
import util from './util'
import * as service from '../services/index'
import Promise from './libs/es6-promise'

const DEFAULT_CACHE = {
  setting: {
    showScheduleDate: true,
  },
  systemInfo: wx.getSystemInfoSync(),
}

wx.ooApi = api
wx.ooCache = Object.assign({}, DEFAULT_CACHE)
wx.ooConfig = config
wx.ooEvent = event
wx.ooObjectPath = objectPath
wx.ooPro = {}
wx.ooRequest = request
wx.ooService = service
wx.ooString = locales.getString()
wx.ooTip = tip
wx.ooUtil = util

const fnGroup = [
  'checkIsSoterEnrolledInDevice',
  'chooseImage',
  'request',
  'saveFile',
  'showActionSheet',
  'showModal',
  'showToast',
  'startSoterAuthentication',
]

for (const fn of fnGroup) {
  wx.ooPro[fn] = (options = {}) => {
    return new Promise((resolve, reject) => {
      wx[fn](Object.assign(options, {
        success: resolve,
        fail: reject,
      }))
    })
  }
}

if (locales.isDefault() === false) {
  wx.setTabBarItem({
    index: 0,
    text: wx.ooString.tabbar.schedule,
  })
  wx.setTabBarItem({
    index: 1,
    text: wx.ooString.tabbar.discover,
  })
  wx.setTabBarItem({
    index: 2,
    text: wx.ooString.tabbar.me,
  })
}

wx.ooLogout = function () {
  wx.clearStorage()
  wx.ooCache = Object.assign({ _logout: true }, DEFAULT_CACHE)

  wx.ooEvent.emit('logout')
  wx.ooSaveData({ tip: { guide: true }})
}

wx.ooSaveData = function (obj) {
  if (typeof obj !== 'object') {
    throw new TypeError('参数类型错误')
  }

  console.group('保存数据并更新缓存')

  for (const key in obj) {
    const newData = obj[key],
      isObj = Object.prototype.toString.call(newData) === '[object Object]',
      oldData = util.copy(wx.ooCache[key] || (isObj ? {} : null)),
      finallyData = isObj ? Object.assign({}, oldData, newData) : newData

    console.info('key：', key)
    console.info('旧数据：', oldData)
    console.info('新数据：', newData)
    console.info('更新后的数据：', finallyData)

    wx.ooCache[key] = finallyData
    wx.setStorage({ key, data: finallyData })
  }

  console.groupEnd()

  return Promise.resolve(obj)
}

wx.ooSetTitle = function (title) {
  if (locales.isDefault() === false) {
    wx.setNavigationBarTitle({ title })
  }
}

wx.ooShowModal = (options = {}, showCancel = true) => {
  return wx.ooPro.showModal(Object.assign({
    content: '',
    confirmText: wx.ooString.global.modal_confirm,
    cancelText: wx.ooString.global.modal_cancel,
    showCancel,
  }, options))
}

wx.ooShowToast = obj => {
  wx.showToast(Object.assign({
    icon: 'none',
    mask: true,
  }, obj))
}

wx.ooSleep = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

wx.ooIsSoterEnrolled = () => {
  return wx.ooPro.checkIsSoterEnrolledInDevice({
    checkAuthMode: 'fingerPrint',
  })
}

wx.ooStartSoter = (options = {}) => {
  return wx.ooPro.startSoterAuthentication(Object.assign({
    requestAuthModes: ['fingerPrint'],
    challenge: '123456',
  }, options))
}
