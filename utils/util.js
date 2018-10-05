const TextEncoderLite = require('./libs/text-encoder-lite').TextEncoderLite

class Util {
  // 不足两位则补全前导零 # e.g. 1 → 01
  static padNum (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }

  // 处理时间戳 返回日期 # e.g. 2017-01-01
  static disposeDate (timestamp) {
    return ([timestamp.getFullYear(), timestamp.getMonth() + 1, timestamp.getDate()]).map(this.padNum).join('-')
  }

  // 格式化时间戳 返回日期时间 # e.g. 2017-01-01 12:00:00
  // smart: 是否智能处理日期 同一天省略日期 同一年省略年份 否则完整显示日期
  static formatTime (timestamp, smart = true) {
    const targetDate = new Date(timestamp)

    let _date = this.disposeDate(targetDate)

    if (smart) {
      const _tmpDate = this.disposeDate(new Date())

      if (_tmpDate === _date) {
        // 如果年月日相同则不显示日期
        _date = ''
      } else {
        // 否则显示日期 # 那么应该在日期和时间中间加空格
        _date += ' '

        // 如果年份相同 去除年份 # e.g. 2017 - 01-01
        if (_tmpDate.substr(0, 4) == _date.substr(0, 4)) {
          _date = _date.substr(5)
        }
      }
    }

    return _date + ([targetDate.getHours(), targetDate.getMinutes(), targetDate.getSeconds()]).map(this.padNum).join(':')
  }

  static getRandomString () {
    return Math.random().toString(36).substring(2)
  }

  static base64 (value) {
    return wx.arrayBufferToBase64(new TextEncoderLite().encode(value))
  }

  static copy (obj) {
    return JSON.parse(JSON.stringify(obj))
  }

  static isObject (target) {
    return Object.prototype.toString.call(target) === '[object Object]'
  }
}

export default Util
