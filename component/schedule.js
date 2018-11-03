import regeneratorRuntime from '../utils/libs/regenerator-runtime'

const _string = wx.ooString.component_schedule

const renderCurrWeek = (value = 0) => _string.currWeek.replace('{0}', value)

const getWeekTitle = (offsetWeeks = 0) => {
  const getOffsetDate = (date, offsetDays) => {
    return offsetDays ? new Date(date.getTime() + 86400000 * offsetDays) : date
  }

  const getDateOfWeek = (offsetWeeks = 0) => {
    const currDate = new Date()

    // 周日的值是 0
    const currDay = currDate.getDay() || 7

    // 将当前日期的星期减掉一 再乘以负一 即当周的第一天
    let firstDate = getOffsetDate(currDate, (currDay - 1) * -1)

    // 周数偏移
    firstDate = getOffsetDate(firstDate, 7 * offsetWeeks)

    let res = []

    for (let i = 0; i < 7; i++) {
      let date = getOffsetDate(firstDate, i),
        currMonth = date.getMonth()

      res.push({
        date: date.getDate(),
        month: currMonth,
      })
    }

    return res
  }

  return getDateOfWeek(offsetWeeks).map((obj, index) => {
    obj.name = _string.weekName[index]
    return obj
  })
}

let componentParams = {
  data: {
    currWeek: renderCurrWeek(),
    weekTitle: getWeekTitle(),
  },
  methods: {},
  properties: {
    bg: Object,
    showDate: {
      type: Boolean,
      value: true,
    },
    value: {
      type: Array,
      observer: '_scheduleObserver',
    },
  },
}

let _tmp = {}

componentParams.attached = function () {
  wx.ooEvent.on('updateCurrWeek', this._updateCurrWeek, this)
  this._updateCurrWeek()
}

componentParams.methods.renderPage = function () {
  this._updateCurrWeek(_tmp.currWeek)

  this.setData({
    value: wx.ooService.edu.renderSchedule(null, _tmp.currWeek),
    weekTitle: getWeekTitle(_tmp.currWeek - _tmp.orginalCurrWeek),
  })
}

componentParams.methods.showDetail = function (e) {
  const dataSet = e.currentTarget.dataset
  let course

  try {
    course = this.data.value[dataSet.day].data[dataSet.section].data[dataSet.course].data
  } catch (err) {
    console.log('无此课程', dataSet)
    return
  }

  const timeTable = wx.ooService.edu.getTimeTable(course)

  const weekState = [ '', ` # ${_string.detail_week[1]}`, ` # ${_string.detail_week[2]}` ],
    weekRange = course.week.split(':'),
    week = _string.detail_week[0].replace('{0}', `${weekRange[0]}-${weekRange[1]}`) + weekState[weekRange[2]]

  wx.ooShowModal({
    content: [course.name, course.teacher, course.location, week, timeTable].join(' / '),
  }, false)

  wx.vibrateShort()
}

componentParams.methods.touchStart = function (e) {
  _tmp.touchStartX = e.touches[0].pageX
  _tmp.touchStartY = e.touches[0].pageY
}

componentParams.methods.touchMove = function (e) {
  _tmp.touchEndX = e.touches[0].pageX
  _tmp.touchEndY = e.touches[0].pageY
}

componentParams.methods.touchEnd = async function (e) {
  if (!this.data.value || !_tmp.touchEndX || !_tmp.touchEndY) {
    return
  }

  const x = _tmp.touchEndX - _tmp.touchStartX,
    y = _tmp.touchEndY - _tmp.touchStartY,
    widthRange = (wx.ooCache.systemInfo.screenWidth || 375) / 3

  if (Math.abs(x) < Math.abs(y) || Math.abs(x) < widthRange) {
    return
  }

  if (x > 0 && _tmp.currWeek === 1  || x < 0 && _tmp.currWeek === 20) {
    wx.ooShowToast({ title: _string.at_border })
    return
  }

  if (_tmp.currWeek < 0) {
    _tmp.currWeek = 1
  } else {
    _tmp.currWeek += x < 0 ? 1 : -1
  }

  _tmp.touchEndX = _tmp.touchEndY = undefined

  this.renderPage()
}

componentParams.methods.tap = function (e) {
  const lastTapTimestamp = (_tmp.tapTimetamp = _tmp.tapTimetamp || 0)

  _tmp.tapTimetamp = e.timeStamp

  if (e.timeStamp - lastTapTimestamp > 250) {
    return
  }

  console.log('触发双击')

  if (_tmp.currWeek !== _tmp.orginalCurrWeek) {
    _tmp.currWeek = _tmp.orginalCurrWeek
    this.renderPage()
  }
}

componentParams.methods.longPress = function () {
  console.log('触发长按')

  wx.vibrateLong()
  wx.navigateTo({ url: '/pages/edu/schedule/custom' })
}

componentParams.methods._scheduleObserver = function (newValue) {
  let flag,
    weekTitle = wx.ooUtil.copy(this.data.weekTitle)

  // 隐藏没课的周末
  for (let i = 5; i < 7; i++) {
    const _state = weekTitle[i].hidden

    weekTitle[i].hidden = !newValue[i]

    flag = flag || weekTitle[i].hidden !== _state
  }

  if (flag) {
    this.setData({ weekTitle })
  }
}

componentParams.methods._updateCurrWeek = async function (currWeek) {
  if (!currWeek) {
    _tmp.orginalCurrWeek = currWeek = await wx.ooService.edu.getCurrWeek()
  }

  _tmp.currWeek = currWeek

  this.setData({
    currWeek: renderCurrWeek(currWeek),
  })
}

Component(componentParams)
