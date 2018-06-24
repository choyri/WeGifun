import regeneratorRuntime from '../../utils/libs/regenerator-runtime'

let pageParams = {
  data: {
    _string: wx.ooString.service_opac_book,
  },
}

pageParams.onLoad = function (options) {
  console.log('页面参数', options)

  this.setData({
    book: wx.ooService.opac.getBook(options.marc),
  })
}

pageParams.onReady = async function () {
  wx.ooSetTitle(this.data._string.title)

  const bookInfo = await wx.ooService.opac.fetchBookInfo(this.data.book.marc)
  this.setData({ bookInfo })
}

pageParams.bindCopy = function (e) {
  wx.setClipboardData({
    data: e.currentTarget.dataset.text || '',
  })
}

Page(pageParams)
