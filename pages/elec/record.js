import regeneratorRuntime from '../../utils/libs/regenerator-runtime'

const _string = wx.ooString.service_elec_record

let pageParams = {
  data: {
    selectedIndex: 0,
    titleSlider: {
      width: 100 / _string.tab_title.length, // 百分比
      left: 0,
    },
    _string: Object.assign({
        bind: wx.ooString.tabbar_discover.bind,
      },
      _string,
    ),
  },
  _tmp: {},
}

pageParams.onLoad = function () {
  wx.ooEvent.on('dormRetrieve', this.renderPage, this)
  this.renderPage()
}

pageParams.onReady = function () {
  wx.ooSetTitle(this.data._string.title)
}

pageParams.onUnload = function () {
  wx.ooEvent.off(this)
}

pageParams.renderPage = async function (dormInfo) {
  dormInfo = dormInfo || wx.ooService.elec.getDormInfo()
  this._tmp.dormId = dormInfo.id

  this.setData({
    dormInfo: wx.ooService.elec.renderDormInfoWithState(dormInfo.id),
  })

  this.getRecord(this.data.selectedIndex)
}

pageParams.onReachBottom = function () {
  if (this.data.selectedIndex !== 2 || this._tmp.nextPage === 0) {
    return
  }

  console.log('触底刷新')

  this._getDepositRecordOfUser(true)
}

pageParams.bindTitleTap = function (e) {
  const id = e.currentTarget.dataset.id
  console.info('当前点击 tab', id)

  let { selectedIndex, titleSlider } = this.data

  if (selectedIndex === id) {
    return
  }

  selectedIndex = id
  titleSlider.left = titleSlider.width * id

  this.setData({
    selectedIndex,
    titleSlider,
  })

  this.getRecord(id)
}

pageParams.getRecord = function (index) {
  switch (index) {
    case 0:
      this._getConsumeRecord()
      break
    case 1:
      this._getDepositRecordOfDorm()
      break
    case 2:
      this._getDepositRecordOfUser()
      break
    default:
      break
  }
}

pageParams._getConsumeRecord = async function () {
  if (this.data.dormConsume && this._tmp.dormConsumeId === this._tmp.dormId) {
    console.log('宿舍用电 已有数据')
    return
  }

  const recordData = await wx.ooService.elec.fetchConsumeRecord(this._tmp.dormId)
  if (!recordData) {
    return
  }

  this.setData({
    dormConsume: wx.ooService.elec.processConsumeRecord(recordData),
  })

  this._tmp.dormConsumeId = this._tmp.dormId
}

pageParams._getDepositRecordOfDorm = async function () {
  if (this.data.dormDeposit && this._tmp.dormDepositId === this._tmp.dormId) {
    console.log('宿舍购电 已有数据')
    return
  }

  const recordData = await wx.ooService.elec.fetchDepositRecordOfDorm(this._tmp.dormId)
  if (!recordData) {
    return
  }

  if (recordData.length === 0) {
    wx.ooShowToast({ title: this.data._string.dorm_deposit_null })
    return
  }

  this.setData({
    dormDeposit: wx.ooService.elec.processDepositRecordOfDorm(recordData),
  })

  this._tmp.dormDepositId = this._tmp.dormId
}

pageParams._getDepositRecordOfUser = async function (reachBottom = false) {
  if (!wx.ooService.user.isBindCard()) {
    wx.ooShowToast({ title: this.data._string.bind })
    return
  }

  if (this.data.userDeposit && !reachBottom) {
    console.log('用户购电 已有数据')
    return
  }

  const recordData = await wx.ooService.elec.fetchDepositRecordOfUser(this._tmp.nextPage)
  if (!recordData) {
    return
  }
  this._tmp.nextPage = recordData.next

  const userDeposit = wx.ooService.elec.processDepositRecordOfUser(recordData)
  this._tmp.userDeposit = [...(this._tmp.userDeposit || []), ...userDeposit]

  this.setData({
    userDeposit: this._tmp.userDeposit,
  }, () => {
    this._scrollPage()

    wx.createSelectorQuery().select('.user-deposit').boundingClientRect().exec(res => {
      this._tmp.pageHeight = res[0].height
    })
  })
}

pageParams._scrollPage = function () {
  if (this._tmp.nextPage < 3) {
    return
  }

  // 理想状态下 页面向下滚动半屏幕
  wx.pageScrollTo({
    scrollTop: this._tmp.pageHeight - (wx.ooCache.systemInfo.windowHeight / 2),
  })
}

Page(pageParams)
