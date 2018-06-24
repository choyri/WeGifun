import regeneratorRuntime from '../../utils/libs/regenerator-runtime'

let pageParams = {
  data: {
    hasMore: true,
    hideClear: true,
    _string: wx.ooString.service_opac_search,
  },
  _tmp: {},
}

pageParams.onReady = function () {
  wx.ooSetTitle(this.data._string.title)
}

pageParams.onReachBottom = function () {
  if (this.data.hasMore) {
    console.log('触底刷新')
    this.searchBook()
  }
}

pageParams.bindClear = function () {
  this._tmp.currSearch = ''

  this.setData({
    hideClear: true,
    searchValue: '',
  })
}

pageParams.bindConfirm = function () {
  this.bindSearch()
}

pageParams.bindInput = function (e) {
  const value = e.detail.value.trim()

  this._tmp.currSearch = value

  const hideClear = value === ''

  if (hideClear !== this.data.hideClear) {
    this.setData({ hideClear })
  }
}

pageParams.bindSearch = function () {
  const { currSearch = '', lastSearch = '' } = this._tmp

  if (!currSearch || currSearch === lastSearch) {
    return
  }

  if (lastSearch) {
    this._tmp.nextPage = null
    this._tmp.pageHeight = null
  }

  this.searchBook()
}

pageParams.searchBook = async function () {
  const { currSearch = '', lastSearch = '' } = this._tmp
  const isNewSearch = currSearch !== lastSearch
  const query = currSearch || lastSearch

  const searchData = await wx.ooService.opac.search(query, this._tmp.nextPage)
  if (!searchData) {
    return
  }

  this._tmp.lastSearch = query
  this._tmp.nextPage = searchData.next

  this.setData({
    conclusion: this.data._string.conclusion.replace('{0}', searchData.total),
    hasMore: this._tmp.nextPage !== 0,
    hideHead: true,
    nullData: searchData.total === 0,
    searchData: wx.ooService.opac.processSearch(searchData, isNewSearch),
  }, async () => {
    this._scrollPage()

    await wx.ooService.opac.handshake(searchData.list, res => {
      this.setData({ searchData: res })
    })

    wx.createSelectorQuery().select('.result').boundingClientRect().exec(res => {
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
