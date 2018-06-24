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

pageParams.bindUpdateSchedule = async function () {
  if (!wx.ooService.user.isBindEdu()) {
    wx.ooShowToast({ title: this.data._string.bind })
    return
  }

  const modalRes = await wx.ooShowModal({ content: this.data._string.update_schedule })

  if (!modalRes.confirm) {
    return
  }

  const res = await wx.ooService.edu.fetchSchedule()
  if (!res) {
    return
  }

  wx.switchTab({ url: '/pages/tabbar/schedule' })
}

Page(pageParams)
