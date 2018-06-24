import countUp from '../../utils/libs/countup'
import regeneratorRuntime from '../../utils/libs/regenerator-runtime'

let pageParams = {
  data: {
    balance: 'N/A',
    _string: wx.ooString.service_card,
  },
}

pageParams.onLoad = async function () {
  const balance = await wx.ooService.card.fetchBalance()
  if (balance) {
    this.changeBalance(balance)
  }
}

pageParams.onReady = function () {
  wx.ooSetTitle(this.data._string.title)
}

pageParams.changeBalance = function (balance) {
  new countUp(0, balance, 2, .5, {
    printValue (balance) {
      this.setData({ balance: `￥${balance}` })
    }
  }).start()
}

pageParams.navigateToRecord = function () {
  wx.navigateTo({ url: 'record' })
}

Page(pageParams)
