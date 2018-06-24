import en_US from './en_US'
import zh_CN from './zh_CN'

class Locales {
  static _language = null

  static getString () {
    return this.isDefault() ? zh_CN : en_US
  }

  static isDefault () {
    this._language = this._language || wx.getStorageSync('setting').lang || wx.getSystemInfoSync().language || 'zh_CN'

    return this._language.indexOf('zh') !== -1
  }
}

export default Locales
