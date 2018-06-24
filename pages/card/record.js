import regeneratorRuntime from '../../utils/libs/regenerator-runtime'

let pageParams = {
  data: {
    picker: wx.ooService.card.getDatePicker(),
    _string: Object.assign({
        btn: wx.ooString.global.btn_title,
      },
      wx.ooString.service_card_record,
    ),
  },
}

pageParams.onReady = function () {
  wx.ooSetTitle(this.data._string.title)
}

pageParams.bindClose = function () {
  this.setData({ showRecord: false })
}

pageParams.bindDateChange = function (e) {
  // 结束日期选择器的开始日期 不能超过 开始日期选择器的结束日期

  let picker = wx.ooUtil.copy(this.data.picker)

  if (e.target.id === 'startPicker') {
    picker.from.value = picker.to.start = e.detail.value
  } else {
    picker.to.value = picker.from.end = e.detail.value
  }

  this.setData({ picker })
}

pageParams.bindSubmit = async function () {
  const date = [
    this.data.picker.from.value,
    this.data.picker.to.value,
  ]

  const recordData = await wx.ooService.card.fetchRecord(date)
  if (!recordData) {
    return
  }

  if (recordData.data.length === 0) {
    wx.ooShowToast({ title: this.data._string.noRecord })
    return
  }

  const conclusion = this.data._string.result_conclusion
    .replace('{0}', recordData.data.length)
    .replace('{1}', recordData.amount)

  this.setData({
    conclusion,
    recordData: recordData.data,
    showRecord: true,
  })
}

Page(pageParams)
