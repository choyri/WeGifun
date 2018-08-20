import regeneratorRuntime from '../../utils/libs/regenerator-runtime'

const DEFAULT_DORMID = 101101

let pageParams = {
  data: {
    // 页面默认值
    dormInfo: wx.ooService.elec.getDormInfo(),
    picker: wx.ooService.elec.getDormPicker(),
    _string: Object.assign({
        btn: wx.ooString.global.btn_title,
      },
      wx.ooString.service_elec_setting,
    ),
  },
  _tmp: {},
}

pageParams.onLoad = async function (options) {
  console.log('页面参数', options)
  Object.assign(this._tmp, options)

  this.setData({
    isUpdate: this._tmp.action === 'update',
  })

  let dormId = parseInt(this._tmp.id) || wx.ooService.user.getDorm()

  if (dormId) {
    this._tmp.originalDormId = dormId
  } else if (wx.ooService.user.isBindCard()) {
    dormId = await wx.ooService.user.fetchDorm()
    this._tmp.fetchDorm = true
  } else {
    dormId = DEFAULT_DORMID
  }

  let dormInfo = wx.ooService.elec.renderDormInfo(dormId)
  this._tmp.room = dormInfo.room

  this.renderPage(dormInfo)
  this.renderDormHistory()
}

pageParams.onReady = function () {
  wx.ooSetTitle(this.data._string.title)
}

pageParams.renderPage = function (dormInfo) {
  if (dormInfo.id === this.data.dormInfo.id) {
    return
  }

  this._ooSetData({
    dormInfo,
    picker: wx.ooService.elec.renderDormPicker(dormInfo.id),
  })
}

pageParams.renderDormHistory = function () {
  const dormHistory = wx.ooService.elec.getDormHistory()

  this._ooSetData({
    dormHistory,
    hideEdit: dormHistory.length < 2,
  })
}

pageParams.bindEditHistory = function () {
  this.setData({ editHistory: !this.data.editHistory })
}

pageParams.bindHistoryTap = function (e) {
  console.info('当前点击', e.currentTarget.dataset)
  const { id: dormId, index } = e.currentTarget.dataset

  if (this.data.editHistory) {
    if (index === 0) {
      console.log('删除记录 跳过本人宿舍')
      return
    }

    console.log('删除记录', dormId)

    wx.ooService.elec.deleteDormHistory(dormId)
    this.renderDormHistory()
    return
  }

  const dormInfo = this.data.dormHistory.find(element => element.id === dormId)

  if (dormInfo.id === this._tmp.historyTapId) {
    console.log('重复点击历史记录')
    return
  }

  Object.assign(this._tmp, {
    historyDormInfo: dormInfo,
    historyTapId: dormInfo.id,
    room: dormInfo.room,
  })

  this.renderPage(dormInfo)
}

pageParams.bindInput = function (e) {
  console.info('输入框新值', e.detail.value || '空');

  this._tmp.room = e.detail.value || 0
}

pageParams.bindPickerChange = async function (e) {
  console.log('picker 新值为', e.detail.value)

  // 下标从 0 开始
  const [gardenIndex, buildingIndex] = e.detail.value

  // e.g. [0, 0] => 101
  const location = (gardenIndex + 1) * 100 + (buildingIndex + 1)

  // 新宿舍 id # e.g. 101 => 101000 => 101101
  const id = location * 1000 + this.data.dormInfo.room

  this._ooSetData({
    dormInfo: wx.ooService.elec.renderDormInfo(id),
  })
}

pageParams.bindPickerColumnChange = function (e) {
  console.log('修改的列为', e.detail.column, '值为', e.detail.value)

  const { column, value } = e.detail

  let picker = wx.ooUtil.copy(this.data.picker)
  picker.value[column] = value

  if (column === 0) {
    const buildingSN = wx.ooService.elec.getBuildingSN()[value],
      buildingSNMaxIndex = buildingSN.length - 1

    // 更改楼栋列值域
    picker.range[1] = buildingSN

    // 更改楼栋列值 # 楼栋列值不能超出值域
    if (picker.value[1] > buildingSNMaxIndex) {
      picker.value[1] = buildingSNMaxIndex
    }
  }

  this.setData({ picker })
}

pageParams.bindSubmit = async function () {
  const room = parseInt(this._tmp.room)

  if (room < 101 || room > 660) {
    wx.ooShowToast({ title: this.data._string.room_invalid })
    return
  }

  const dormId = parseInt(`${this.data.dormInfo.location}${this._tmp.room}`)

  if (this._tmp.originalDormId === dormId) {
    wx.ooShowToast({ title: this.data._string.dorm_unchange })
    return
  }

  let dormInfo

  if (this._tmp.historyTapId === dormId) {
    dormInfo = this._tmp.historyDormInfo
  } else {
    // 如果是从服务端获取的 id 就不需要检测
    if (!this._tmp.fetchDorm) {
      const checkRes = await wx.ooService.elec.checkDorm(dormId)

      if (!checkRes) {
        wx.ooShowToast({ title: this.data._string.dorm_null })
        return
      }
    }

    dormInfo = wx.ooService.elec.renderDormInfo(dormId)
  }

  if (this.data.isUpdate) {
    wx.ooService.user.saveDorm(dormId)
  }

  // 先返回 否则看不到 loading
  wx.navigateBack()

  wx.ooEvent.emit(this.data.isUpdate ? 'dormUpdate' : 'dormRetrieve', dormInfo)
  wx.ooService.elec.updateDormHistory(dormId, this.data.isUpdate)
}

pageParams._ooSetData = function (obj) {
  for (let key in obj) {
    // 同步更改 pageParams 里对应的值 这样重新打开本页时就可以保持最新状态
    wx.ooObjectPath.set(pageParams, `data.${key}`, obj[key])

    this.setData({ [key]: obj[key] })
  }
}

Page(pageParams)
