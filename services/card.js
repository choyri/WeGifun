import regeneratorRuntime from '../utils/libs/regenerator-runtime'

class Card {
  static async fetchBalance () {
    return await wx.ooRequest.getCardBalance()
  }

  static getDatePicker () {
    const recentDate = this._getRecentDate()

    return {
      from: {
        start: this._getDateOfPreMonth(6),  // 最远查询到六个月前
        end: recentDate.end,
        value: recentDate.start,
      },
      to: {
        start: recentDate.start,
        end: recentDate.end,
        value: recentDate.end,
      },
    }
  }

  static async fetchRecord (date) {
    const recordData = await wx.ooRequest.getCardRecord(date)
    if (!recordData) {
      return
    }

    return this._processRecord(recordData)
  }

  // 获取当前时间往前推 x 个月的一号的日期
  static _getDateOfPreMonth (months = 1) {
    const targetDate = new Date((new Date()).getTime() - 2592000000 * months)

    return ([targetDate.getFullYear(), targetDate.getMonth() + 1, 1]).map(wx.ooUtil.padNum).join('-')
  }

  // 获取指定天数的最近一段时间的头尾日期
  static _getRecentDate (days = 7) {
    const endDate = new Date(),
      startDate = new Date(endDate.getTime() - 86400000 * days)

    return {
      start: wx.ooUtil.disposeDate(startDate),
      end: wx.ooUtil.disposeDate(endDate),
    }
  }

  static _processRecord (data) {
    let amount = 0

    const _data = wx.ooUtil.copy(data).map(item => {
      amount += item.money
      item.time = wx.ooUtil.formatTime(item.time * 1000)
      return item
    })

    return {
      amount: amount.toFixed(2),
      data: _data,
    }
  }
}

export default Card
