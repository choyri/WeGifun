import regeneratorRuntime from './libs/regenerator-runtime'

const AUTH_TYPE_CARD = 'card',
  AUTH_TYPE_EDU = 'edu'

class Request {
  static _authCache = []

  static _getAuthValue ({ id, pwd }) {
    return 'Basic ' + wx.ooUtil.base64(`${id}:${pwd}`)
  }

  static _getAuthorization (authType) {
    if (this._authCache[authType]) {
      return this._authCache[authType]
    }

    const userAccount = wx.ooService.user.getAccount()

    return this._authCache[authType] = this._getAuthValue({
      id: userAccount.id,
      pwd: userAccount[`${authType}Pwd`],
    })
  }

  static async _proxy(params) {
    if (!params.hideLoading) {
      wx.showLoading({
        title: wx.ooString.global.loading,
        mask: true,
      })
    }

    if (params.url === undefined) {
      throw new TypeError('缺少属性 URL')
    }

    if (params.auth) {
      params.header = params.header || {}
      params.header.Authorization = params.auth
    }

    try {
      const response = await wx.ooPro.request(params)
      console.log(response)

      if (!params.hideLoading) {
        wx.hideLoading()
      }

      if (response.statusCode < 400) {
        return response
      }

      if (!params.quietMode) {
        const content = response.data.code ? `#${response.data.code} ${response.data.msg}` : wx.ooString.global.service_unavailable
        await wx.ooShowModal({ content }, false)
      }
    } catch (e) {
      console.error(e)

      if (!params.hideLoading) {
        wx.hideLoading()
      }

      if (!params.quietMode) {
        wx.ooShowModal({ content: wx.ooString.global.request_failed }, false)
      }
    }
  }

  static async _cardProxy(params) {
    params.auth = this._getAuthorization(AUTH_TYPE_CARD)

    return this._proxy(params)
  }

  static async _eduProxy(params) {
    params.auth = this._getAuthorization(AUTH_TYPE_EDU)

    return this._proxy(params)
  }

  static async wechatLogin ([code, uid]) {
    const resp = await this._proxy({
      data: { code, uid },
      hideLoading: true,
      method: 'POST',
      quietMode: true,
      url: wx.ooApi('wechatLogin'),
    })

    return resp && resp.data.data
  }

  static async getNotice () {
    const res = await this._proxy({
      hideLoading: true,
      quietMode: true,
      url: wx.ooApi('notice'),
    })

    return res && res.data.data
  }

  static triggerAlarm (content) {
    this._proxy({
      data: { content },
      hideLoading: true,
      method: 'POST',
      quietMode: true,
      url: wx.ooApi('alarm'),
    })
  }

  static async getUserDorm () {
    const res = await this._cardProxy({
      url: wx.ooApi('dorm'),
    })

    return res && res.data.data
  }

  static async checkDorm (id) {
    const url = wx.ooApi('dormCheck').replace('{id}', id)
    const res = await this._proxy({ quietMode: true, url })

    return res && res.statusCode === 200 ? true : false
  }

  static async eduAuth (id, pwd) {
    const auth = this._getAuthValue({ id, pwd })

    const res = await this._proxy({
      auth,
      url: wx.ooApi('eduAuth'),
    })

    const authRes = res && res.statusCode === 204 ? true : false

    if (authRes) {
      this._authCache[AUTH_TYPE_EDU] = auth
    }

    return authRes
  }

  static async getSchoolStartDate () {
    const res = await this._proxy({
      url: wx.ooApi('eduStartDate'),
    })

    return res && res.data.data
  }

  static async getEduSchedule ({ grade, semester }) {
    const res = await this._eduProxy({
      data: { grade, semester },
      url: wx.ooApi('eduSchedule'),
    })

    return res && res.data.data
  }

  static async getEduScore ({ grade, semester }) {
    const res = await this._eduProxy({
      data: { grade, semester },
      url: wx.ooApi('eduScore'),
    })

    return res && res.data.data
  }

  static async getEduUserInfo () {
    const ret = await this._eduProxy({
      url: wx.ooApi('eduUserInfo'),
    })

    return ret && ret.data.data
  }

  static async cardAuth (id, pwd) {
    const auth = this._getAuthValue({ id, pwd })

    const res = await this._proxy({
      auth,
      url: wx.ooApi('cardAuth'),
    })

    const authRes = res && res.statusCode === 204 ? true : false

    if (authRes) {
      this._authCache[AUTH_TYPE_CARD] = auth
    }

    return authRes
  }

  static async getCardBalance () {
    const res = await this._cardProxy({
      url: wx.ooApi('cardBalance'),
    })

    return res && res.data.data
  }

  static async getCardRecord ([start_date, end_date]) {
    const res = await this._cardProxy({
      data: { start_date, end_date },
      url: wx.ooApi('cardRecord'),
    })

    return res && res.data.data
  }

  static async checkElecDeposit (dorm_id) {
    const res = await this._cardProxy({
      data: { dorm_id },
      url: wx.ooApi('excardElecDeposit'),
    })

    return res && res.data.data
  }

  static async elecDeposit (dorm_id, money) {
    const res = await this._cardProxy({
      data: { dorm_id, money },
      method: 'POST',
      url: wx.ooApi('excardElecDeposit'),
    })

    return res && res.statusCode === 204 || false
  }

  static async getElecDepositRecordOfUser (page = 1) {
    const res = await this._cardProxy({
      data: { page },
      url: wx.ooApi('excardElecRecord'),
    })

    return res && res.data.data
  }

  static async getElecBalance (dorm_id) {
    const res = await this._proxy({
      data: { dorm_id },
      url: wx.ooApi('elecBalance'),
    })

    return res && res.data.data
  }

  static async getElecConsumeRecord (dorm_id) {
    const res = await this._proxy({
      data: { dorm_id },
      url: wx.ooApi('elecRecordConsumption'),
    })

    return res && res.data.data
  }

  static async getElecDepositRecordOfDorm (dorm_id) {
    const res = await this._proxy({
      data: { dorm_id },
      url: wx.ooApi('elecRecordDeposit'),
    })

    return res && res.data.data
  }

  static async opacSearch (query, page = 1) {
    const res = await this._proxy({
      data: { query, page },
      url: wx.ooApi('opacSearch'),
    })

    return res && res.data.data
  }

  static async opacHandShake (marc, isbn) {
    const res = await this._proxy({
      data: { marc, isbn },
      hideLoading: true,
      quietMode: true,
      url: wx.ooApi('opacHandShake'),
    })

    return res && res.data.data
  }

  static async getOpacBookInfo (marc) {
    const res = await this._proxy({
      data: { marc },
      url: wx.ooApi('opacBook'),
    })

    return res && res.data.data
  }

  static async getCetTicket ({ idcard, name }) {
    const ret = await this._proxy({
      data: { idcard, name },
      url: wx.ooApi('cetTicket'),
    })

    return ret && ret.data.data
  }
}

export default Request
