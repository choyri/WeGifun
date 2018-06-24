import regeneratorRuntime from '../../utils/libs/regenerator-runtime'

let pageParams = {
  data: {
    _string: Object.assign({
        btn: wx.ooString.global.btn_title,
      },
      wx.ooString.service_edu_score,
    ),
  },
}

pageParams.onReady = function () {
    wx.ooSetTitle(this.data._string.title)
}

pageParams.bindSchoolTimeChange = function (e) {
  this.setData({ schoolTime: e.detail.value })
}

pageParams.bindClose = function () {
  this.setData({ showRecord: false })
}

pageParams.bindSubmit = async function () {
  const scoreData = await wx.ooService.edu.fetchScore(this.data.schoolTime)
  if (!scoreData) {
    return
  }

  if (scoreData.length === 0) {
    wx.ooShowToast({ title: this.data._string.noRecord })
    return
  }

  this.setData({
    showRecord: true,
    scoreData,
  })
}

Page(pageParams)
