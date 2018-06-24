import regeneratorRuntime from './libs/regenerator-runtime'

class Tip {
  static async _do (key, showCancel = false) {
    wx.ooCache.tip = wx.ooCache.tip || {}

    if (wx.ooCache.tip[key]) {
      return false
    }

    await wx.ooSleep(500)

    wx.ooSaveData({ tip: { [key]: true } })

    const res = await wx.ooShowModal({
      title: wx.ooString.global.tip,
      content: wx.ooString.tip[key],
    }, showCancel)

    return res.confirm
  }

  static bind (is_disabled) {
    return is_disabled ? this._do('bind_edit') : this._do('bind_new')
  }

  static async guide () {
    const res = await this._do('guide', true)

    if (res) {
      wx.navigateTo({ url: '/pages/common/guide' })
    }
  }
}

export default Tip
