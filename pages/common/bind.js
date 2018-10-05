import regeneratorRuntime from '../../utils/libs/regenerator-runtime'

const userAccount = wx.ooService.user.getAccount()

let pageParams = {
  data: {
    account: wx.ooService.user.getAccount(),
    editMode: wx.ooService.user.isLogin(),
    focusState: {},
    _string: Object.assign({
        btn: wx.ooString.global.btn_title,
      },
      wx.ooString.common_bind,
    ),
  },
  _tmp: {
    orginalInput: wx.ooService.user.getAccount(),
  },
}

pageParams.onLoad = function () {
  if (wx.ooCache._logout) {
    this._processPageParams()
    this._tmp.orginalInput = wx.ooService.user.getAccount()
    this.setData({
      account: wx.ooService.user.getAccount(),
      editMode: false,
    })
    wx.ooCache._logout = null
  }
}

pageParams.onReady = async function () {
  wx.ooSetTitle(this.data._string.title)
  wx.ooTip.bind(this.data.editMode)
}

pageParams.bindFocusBlur = function (e) {
  this.setData({
    [`focusState.${e.currentTarget.id}`]: e.type === 'focus',
  })
}

pageParams.bindHelp = function () {
  wx.ooShowModal({
    content: this.data.editMode ? wx.ooString.tip.bind_edit : wx.ooString.tip.bind_new,
  }, false)
}

pageParams.bindInput = function (e) {
  this.setData({
    [`account.${e.currentTarget.id}`]: e.detail.value,
  })
}

pageParams.bindSubmit = async function () {
  const { id, cardPwd, eduPwd } = this.data.account

  const isIdError = () => !id || id.length < 5 || id.length > 10 ? true : false,
    isPwdError = () => {
      const isCardPwdError = () => cardPwd && cardPwd.length !== 6 ? true : false,
        isEduPwdError = () => eduPwd && eduPwd.length < 6 ? true : false,
        isPwdEmpty = () => !cardPwd && !eduPwd ? true : false
      return isPwdEmpty() || isCardPwdError() || isEduPwdError()
    }

  if (isIdError()) {
    wx.ooShowToast({ title: this.data._string.error_id })
    return
  }

  if (isPwdError()) {
    wx.ooShowToast({ title: this.data._string.error_pwd })
    return
  }

  if (cardPwd && cardPwd !== this._tmp.orginalInput.cardPwd && !this._tmp.cardFlag) {
    console.log('一卡通鉴权开始')

    const authData = await wx.ooRequest.cardAuth(id, cardPwd)

    if (authData === false) {
      wx.ooShowToast({ title: this.data._string.error_card })
      return
    }

    console.log('一卡通鉴权成功')
    wx.ooService.user.saveCardAccount(id, cardPwd)

    // 成功的话设置 flag 那么如果遇到其他密码错误 重试时就不会进入该鉴权
    this._tmp.cardFlag = true
  }

  if (eduPwd && eduPwd !== this._tmp.orginalInput.eduPwd && !this._tmp.eduFlag) {
    console.log('教务鉴权开始')

    const authData = await wx.ooRequest.eduAuth(id, eduPwd)

    if (authData === false) {
      wx.ooShowToast({ title: this.data._string.error_edu })
      return
    }

    console.log('教务鉴权成功')
    wx.ooService.user.saveEduAccount(id, eduPwd)

    // 成功的话设置 flag 那么如果遇到其他密码错误 重试时就不会进入该鉴权
    this._tmp.eduFlag = true
  }

  if (!this._tmp.cardFlag && !this._tmp.eduFlag) {
    wx.ooShowToast({ title: this.data._string.unchange })
    return
  }

  wx.ooEvent.emit('bindSuccess')
  this._processPageParams()

  // 如果是绑定教务 询问是否获取课表
  if (this._tmp.eduFlag) {
    const modalRes = await wx.ooShowModal({ content: this.data._string.get_schedule })

    if (modalRes.confirm) {
      wx.ooService.edu.fetchSchedule()
    }
  }

  wx.navigateBack()
}

pageParams.clearInput = function (e) {
  this.setData({
    [`account.${e.currentTarget.dataset.target}`]: '',
  })
}

pageParams._processPageParams = function () {
  pageParams.data.account = wx.ooService.user.getAccount()
  pageParams.data.editMode = wx.ooService.user.isLogin()
  pageParams._tmp.orginalInput = wx.ooService.user.getAccount()
}

Page(pageParams)
