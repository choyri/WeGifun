import regeneratorRuntime from '../utils/libs/regenerator-runtime'

class Opac {
  static books = {}
  static perfectSearchRes = []
  static lastSearchRes = []

  static getBook (marc) {
    return this.books[marc]
  }

  static async fetchBookInfo (marc) {
    const stateValue = wx.ooString.service_opac_book.collection_state

    let bookInfo = await wx.ooRequest.getOpacBookInfo(marc)

    if (!bookInfo) {
      return
    }

    for (let item of bookInfo.collection) {
      if (item.state === 'read') {
        item.state = stateValue[0]
      } else if (item.state === 'ok') {
        item.state = stateValue[1]
        item.available = true
      } else {
        item.state = stateValue[2].replace('{0}', item.state)
      }
    }

    return bookInfo
  }

  static async handshake (searchData, callback) {
    const resPromises = searchData.map(async item => {
      // 有的书会包含多个 ISBN 此时只要一个
      return await wx.ooRequest.opacHandShake(item.marc, item.isbn.split(',')[0])
    })

    for (const index in resPromises) {
      const handshakeData = await resPromises[index]

      if (!handshakeData) {
        console.log('握手超时')
        continue
      }

      callback(this._processHandshake(handshakeData, index))
    }

    this.perfectSearchRes = [...this.perfectSearchRes, ...this.lastSearchRes]
  }

  static async search (query, page) {
    return await wx.ooRequest.opacSearch(query, page || 1)
  }

  static processSearch (data, isNewSearch) {
    this.lastSearchRes = data.list

    for (const item of this.lastSearchRes) {
      this.books[item.marc] = item
    }

    if (isNewSearch) {
      this.perfectSearchRes = []
    }

    return [...this.perfectSearchRes, ...this.lastSearchRes]
  }

  static _processHandshake (data, index) {
    index = parseInt(index)

    Object.assign(this.books[data.marc], data)

    const amount = wx.ooString.service_opac_search.book_amount
      .replace('{0}', data.total)
      .replace('{1}', data.available)

    Object.assign(this.lastSearchRes[index], data, { amount })

    return [...this.perfectSearchRes, ...this.lastSearchRes]
  }
}

export default Opac
