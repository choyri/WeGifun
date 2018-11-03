import regeneratorRuntime from '../../utils/libs/regenerator-runtime'

let pageParams = {
  data: {
    eduCalendarUrl: wx.ooConfig.eduCalendarUrl,
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
    wx.ooShowToast({ title: this.data._string[`bind_${type}`] })
    return
  }

  if (src) {
    url += `?src=${src}`
  }

  wx.navigateTo({ url })
}

pageParams.bindSchedule = async function () {
  const ret = await wx.ooPro.showActionSheet({ itemList: this.data._string.schedule_list })
  const index = ret.tapIndex

  switch (index) {
    case 0:
      this.bindNavigator({
        currentTarget: { dataset: {  url: '/pages/edu/schedule/update', type: 'edu' } }
      })
      break
    case 1:
    default:
      wx.navigateTo({ url: '/pages/edu/schedule/custom' })
  }
}

Page(pageParams)
