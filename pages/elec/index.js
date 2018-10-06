import countUp from '../../utils/libs/countup'
import regeneratorRuntime from '../../utils/libs/regenerator-runtime'

let pageParams = {
  data: {
    balance: 'N/A',
    _string: Object.assign({
        bind: wx.ooString.tabbar_discover.bind_card,
      },
      wx.ooString.service_elec,
    ),
  },
  _tmp: {},
}

pageParams.onLoad = async function () {
  wx.ooEvent.on('dormUpdate', this.renderPage, this)

  const dormId = wx.ooService.user.getDorm()

  if (!dormId) {
    wx.ooShowToast({ title: this.data._string.dorm_null, duration: 2000 })
    await wx.ooSleep(2000)
    this.navigateToSetting()
    return
  }

  this.renderPage(wx.ooService.elec.renderDormInfo(dormId))
}

pageParams.onShow = async function () {
  if (this.data.dormInfo || this._isFristOpen()) {
    return
  }

  await wx.ooShowModal({ content: this.data._string.exit }, false)
  wx.navigateBack()
}

pageParams.onReady = function () {
  wx.ooSetTitle(this.data._string.title)
}

pageParams.onUnload = function () {
  wx.ooEvent.off(this)
}

pageParams.renderPage = async function (dormInfo) {
  this.setData({ dormInfo })

  const balance = await wx.ooService.elec.fetchBalance(dormInfo.id)
  if (balance) {
    this.changeBalance(balance)
  }
}

pageParams.changeBalance = function (balance) {
  new countUp(0, balance, 2, .5, {
    printValue (balance) {
      this.setData({ balance: `${balance}` })
    }
  }).start()
}

pageParams.navigateTo = function (e) {
  const target = e.currentTarget.dataset.target

  if (target === 'deposit' && !wx.ooService.user.isBindCard()) {
    wx.ooShowToast({ title: this.data._string.bind })
    return
  }

  wx.navigateTo({ url: target })
}

pageParams.navigateToSetting = function () {
  wx.navigateTo({ url: 'setting?action=update' })
}

pageParams._isFristOpen = function () {
  if (this._tmp.openFlag) {
    console.log('非首次打开页面')
    return false
  }
  console.log('首次打开页面')
  this._tmp.openFlag = true
  return true
}

Page(pageParams)
