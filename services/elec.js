import regeneratorRuntime from '../utils/libs/regenerator-runtime'

const DEFAULT_DORM_ID = 101101

class Elec {
  static _buildingSN = null

  static async fetchBalance (dormId) {
    return await wx.ooRequest.getElecBalance(dormId)
  }

  // 楼栋序号 # 各园区的楼栋数量 # 下标从 1 开始
  static getBuildingSN () {
    return this._buildingSN || (this._buildingSN = [10, 7, 6, 14, 2, 3, 1].map(x => [...Array(x + 1).keys()].slice(1)))
  }

  static async checkDorm (dormId) {
    return await wx.ooRequest.checkDorm(dormId)
  }

  static getDormHistory () {
    return (wx.ooCache.dormHistory || []).map(id => this.renderDormInfo(id))
  }

  static updateDormHistory (dormId, isDefault = false) {
    let dormHistory = wx.ooUtil.copy(wx.ooCache.dormHistory || [])

    if (isDefault) {
      dormHistory.unshift(dormId)
    } else {
      dormHistory.splice(1, 0, dormId)
    }

    // 去重并取最多前六个数据
    dormHistory = Array.from(new Set(dormHistory)).slice(0, 6)

    wx.ooSaveData({ dormHistory })
  }

  static deleteDormHistory (dormId) {
    let dormHistory = wx.ooUtil.copy(wx.ooCache.dormHistory || [])

    dormHistory.splice(dormHistory.indexOf(dormId), 1)

    wx.ooSaveData({ dormHistory })
  }

  static getDormInfo () {
    const dormId = wx.ooService.user.getDorm() || DEFAULT_DORM_ID

    return this.renderDormInfo(dormId)
  }

  static renderDormInfo (id) {
    id = id || DEFAULT_DORM_ID
    const _id = id.toString()

    let res = {
      name: 'N/A',
    }

    Object.assign(res, {
      id,
      garden: parseInt(_id.substr(0, 1)),
      building: parseInt(_id.substr(1, 2)),
      location: parseInt(_id.substr(0, 3)),
      room: parseInt(_id.substr(3, 3)),
    })

    let locationName = wx.ooString.service_elec_setting.dorm_garden[res.garden - 1]

    // 7表示综合楼 不需要跟楼号
    if (res.garden !== 7) {
      locationName += ` ${res.building}`
    }

    Object.assign(res, {
      locationName,
      name: `${locationName} # ${res.room}`,
    })

    return res
  }

  static renderDormInfoWithState (id) {
    const STATE = {
      default: {
        state: wx.ooString.service_elec_setting.dorm_state_default,
        default: true,
      },
      other: {
        state: wx.ooString.service_elec_setting.dorm_state_other,
        default: false,
      },
    }

    const dormInfo = this.renderDormInfo(id),
      userDorm = wx.ooService.user.getDorm()

    Object.assign(dormInfo, userDorm === dormInfo.id ? STATE.default : STATE.other)

    return dormInfo
  }

  static getDormPicker () {
    const dormId = wx.ooService.user.getDorm() || DEFAULT_DORM_ID

    return this.renderDormPicker(dormId)
  }

  static renderDormPicker (id) {
    const dormInfo = this.renderDormInfo(id)

    return {
      range: [wx.ooString.service_elec_setting.dorm_garden, this.getBuildingSN()[dormInfo.garden - 1]],
      value: [dormInfo.garden - 1, dormInfo.building - 1],
    }
  }

  static async deposit (dormId, money) {
    return await wx.ooRequest.elecDeposit(dormId, money)
  }

  static async checkDeposit (dormId) {
    return await wx.ooRequest.checkElecDeposit(dormId)
  }

  static getDepositAmountItems () {
    // 0 代表自定义
    return [{ value: 5 }, { value: 10 }, { value: 15 }, { value: 20 }, { value: 50 }, { value: 0 }]
  }

  static async fetchConsumeRecord (dormId) {
    return await wx.ooRequest.getElecConsumeRecord(dormId)
  }

  // 处理宿舍用电数据
  static processConsumeRecord (data) {
    let res = wx.ooUtil.copy(data)

    res.list = [{
      unique: 'title',
      data: wx.ooString.service_elec_record.dorm_consume_table_title,
    }]

    for (const item of data.list) {
      res.list.push({
        unique: item.date,
        data: [item.date, item.usage, item.money],
      })
    }

    return res
  }

  static async fetchDepositRecordOfDorm (dormId) {
    return await wx.ooRequest.getElecDepositRecordOfDorm(dormId)
  }

  // 处理宿舍购电数据
  static processDepositRecordOfDorm (data) {
    let res = []

    for (const item of data) {
      res.push({
        unique: item.time,
        data: [wx.ooUtil.formatTime(item.time * 1000), `￥${item.money}`],
      })
    }

    return res
  }

  static async fetchDepositRecordOfUser (nextPage) {
    return await wx.ooRequest.getElecDepositRecordOfUser(nextPage)
  }

  // 处理用户购电数据
  static processDepositRecordOfUser (data) {
    return data.list.map(item => {
      return {
        unique: item.time,
        data: Object.assign({}, item, {
          time: wx.ooUtil.formatTime(item.time * 1000),
        }),
      }
    })
  }
}

export default Elec
