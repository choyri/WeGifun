import regeneratorRuntime from '../../utils/libs/regenerator-runtime'

let pageParams = {
  data: {
    focusState: {},
    user: {},
    _string: Object.assign({
        btn: wx.ooString.global.btn_title,
      },
      wx.ooString.service_cet_ticket,
    ),
  },
  _tmp: {},
}

pageParams.onReady = function () {
  wx.ooSetTitle(this.data._string.title)
  wx.ooTip.cetFill()
}

pageParams.bindClearInput = function (e) {
  this.setData({
    [`user.${e.currentTarget.dataset.target}`]: '',
  })
}

pageParams.bindFocusBlur = function (e) {
  this.setData({
    [`focusState.${e.currentTarget.id}`]: e.type === 'focus',
  })
}

pageParams.bindHelp = function () {
  wx.ooShowModal({
    content: wx.ooString.tip.cet_fill,
  }, false)
}

pageParams.bindInput = function (e) {
  this.setData({
    [`user.${e.currentTarget.id}`]: e.detail.value,
  })
}

pageParams.bindQuickFill = async function () {
  if (!wx.ooService.user.isBindEdu()) {
    wx.ooShowToast({ title: this.data._string.bind })
    return
  }

  const ret = await wx.ooService.edu.fetchUserInfo()

  this.setData({ user: ret })
}

pageParams.bindSubmit = async function () {
  const { idcard, name } = this.data.user

  if (!idcard || idcard.length !== 18 || !name || name.length < 2) {
    wx.ooShowToast({ title: this.data._string.error_input })
    return
  }

  const ret = await wx.ooRequest.getCetTicket({ idcard, name })
  if (!ret) {
    return
  }

  const content = this.data._string.result.replace('{0}', ret.id)
  await wx.ooShowModal({ content }, false)

  wx.setClipboardData({ data: ret.id })
}

Page(pageParams)
