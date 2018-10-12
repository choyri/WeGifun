import regeneratorRuntime from '../../utils/libs/regenerator-runtime'

let pageParams = {
  data: {
    amountItems: wx.ooService.elec.getDepositAmountItems(),
    checkDorm: 'N/A',
    pwdIcon: { right: false, show: false },
    supportSoter: false,
    _string: Object.assign({
        btn: wx.ooString.global.btn_title,
      },
      wx.ooString.service_elec_deposit,
    ),
  },
  _tmp: {},
}

pageParams.onLoad = function () {
  wx.ooEvent.on('dormRetrieve', this.renderPage, this)
  this.renderPage()

  if (wx.ooCache.supportSoter && wx.ooCache.supportSoter !== this.data.supportSoter) {
    this.setData({ supportSoter: wx.ooCache.supportSoter })
  }
}

pageParams.onReady = function () {
  wx.ooSetTitle(this.data._string.title)
}

pageParams.onUnload = function () {
  wx.ooEvent.off(this)
}

pageParams.renderPage = async function (dormInfo) {
  dormInfo = dormInfo || wx.ooService.elec.getDormInfo()

  dormInfo = wx.ooService.elec.renderDormInfoWithState(dormInfo.id)
  this.setData({ dormInfo })

  const checkDorm = await wx.ooService.elec.checkDeposit(dormInfo.id)
  if (checkDorm) {
    this.setData({ checkDorm })
  }
}

pageParams.bindAmountChange = function (e) {
  const amount = parseInt(e.detail.value)
  this._tmp.amount = amount || this._tmp.customAmount

  let amountItems = wx.ooUtil.copy(this.data.amountItems)

  for (let item of amountItems) {
    item.checked = item.value === amount
  }

  this.setData({ amountItems })
}

pageParams.bindAmountInput = function (e) {
  const amount = parseInt(e.detail.value || 0)
  this._tmp.amount = this._tmp.customAmount = amount
}

pageParams.bindPwdInput = function (e) {
  const pwd = e.detail.value

  let pwdIcon = {}

  if (pwd.length === 6) {
    const checkRes = wx.ooService.user.checkCardPwd(pwd)

    this._tmp.auth = pwdIcon.right = checkRes
    pwdIcon.show = true
  } else {
    this._tmp.auth = false
    pwdIcon.show = false
  }

  if (pwdIcon.show !== this.data.pwdIcon.show) {
    this.setData({ pwdIcon })
  }
}

pageParams.bindSubmit = async function () {
  if (!this._tmp.amount) {
    wx.ooShowToast({ title: this.data._string.error_amount })
    return
  }

  if (!this.data.supportSoter && !this._tmp.auth) {
    wx.ooShowToast({ title: this.data._string.error_auth })
    return
  }

  const confirmContent = this.data._string.confirm
    .replace('{0}', this.data.checkDorm)
    .replace('{1}', this._tmp.amount)

  const modalRes = await wx.ooShowModal({ content: confirmContent })

  if (!modalRes.confirm) {
    console.log('取消充值')
    return
  }

  if (this.data.supportSoter) {
    const soterRet = await wx.ooStartSoter({
      challenge: this.data.checkDorm,
      authContent: this.data._string.prove_tip,
    }).catch(ret => {
      wx.ooSaveData({ supportSoter: false })
      return ret
    })

    console.log(soterRet)

    if (soterRet.errCode !== 0) {
      wx.ooShowModal({ content: this.data._string.soter_fail }, false)
      this.setData({ supportSoter: false })
      return
    }
  }

  const depositRes = await wx.ooService.elec.deposit(this.data.dormInfo.id, this._tmp.amount)
  if (!depositRes) {
    return
  }

  wx.ooShowToast({ title: this.data._string.success, icon: 'success' })
  await wx.ooSleep(1500)

  wx.navigateBack()
}

Page(pageParams)
