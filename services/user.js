import regeneratorRuntime from '../utils/libs/regenerator-runtime'

class User {
  static getAccount () {
    const user = wx.ooCache.user

    return {
      id: user && user.id || '',
      cardPwd: user && user.cardPwd || '',
      eduPwd: user && user.eduPwd || '',
    }
  }

  static saveCardAccount (id, cardPwd) {
    wx.ooSaveData({ user: { id, cardPwd } })
  }

  static checkCardPwd (pwd) {
    return this.getAccount().cardPwd == pwd ? true : false
  }

  static saveEduAccount (id, eduPwd) {
    wx.ooSaveData({ user: { id, eduPwd } })
  }

  static getUid () {
    return this.getAccount().id || wx.ooString.tabbar_me.unbind
  }

  static isBind (type = '') {
    return this.getAccount()[`${type}Pwd`] ? true : false
  }

  static isBindCard () {
    return this.getAccount().cardPwd ? true : false
  }

  static isBindEdu () {
    return this.getAccount().eduPwd ? true : false
  }

  static isLogin () {
    return this.getAccount().id ? true : false
  }

  static getDorm () {
    return wx.ooCache.user && wx.ooCache.user.dorm || null
  }

  static async fetchDorm () {
    return await wx.ooRequest.getUserDorm()
  }

  static saveDorm (dorm) {
    wx.ooSaveData({ user: { dorm } });
  }
}

export default User
