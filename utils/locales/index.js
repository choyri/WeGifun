import en_US from './en_US'
import zh_CN from './zh_CN'

class Locales {
  static _language = null

  static _parseIndex (index) {
    return !index ? null : index === 1 ? 'zh_CN' : 'en_US'
  }

  static getString () {
    return this.isDefault() ? zh_CN : en_US
  }

  static isDefault () {
    this._language = this._language || this._parseIndex(wx.getStorageSync('setting').languageIndex) || wx.getSystemInfoSync().language || 'zh_CN'

    return this._language.indexOf('zh') !== -1
  }
}

export default Locales
