import regeneratorRuntime from '../../../utils/libs/regenerator-runtime'

const weekNum = [...Array(19).keys()].slice(1),
  _string = wx.ooString.service_edu_schedule_custom

let pageParams = {
  data: {
    hideSectionPicker: true,
    disableList: true,
    sectionPicker: {
      range: _string.form_duration_list,
      value: 0,
    },
    timePicker: {
      range: [
        wx.ooString.component_schedule.weekName,
        _string.form_section_list,
        _string.form_section_half_list,
      ],
      value: [0, 0, 0],
    },
    weekPicker: {
      range: [weekNum, weekNum, _string.form_week_list],
      value: [0, 15, 0],
    },
    _string: Object.assign({
        btn: wx.ooString.global.btn_title,
      },
      wx.ooString.service_edu_schedule_custom,
    ),
  },
  _tmp: {
    ret: {},
    duration: 0,
  },
}

pageParams.onLoad = function () {
  const originCustomSchedule = [...(wx.ooCache.edu && wx.ooCache.edu.schedule_custom || [])]

  this.setData({
    originCustomSchedule,
    disableList: originCustomSchedule.length === 0,
    sectionPickerText: this.data.sectionPicker.range[this.data.sectionPicker.value]
  })
}

pageParams.onReady = function () {
    wx.ooSetTitle(this.data._string.title)
}

pageParams.bindTriggerList = function () {
  this.setData({ showList: !(this.data.showList || false) })
}

pageParams.bindDeleteCourse = async function (e) {
  const modalRet = await wx.ooShowModal({ content: this.data._string.delete_confirm })

  if (modalRet.cancel) {
    return
  }

  const { id } = e.currentTarget.dataset

  let schedule = wx.ooUtil.copy(this.data.originCustomSchedule)
  schedule.splice(id, 1)

  this.setData({ originCustomSchedule: schedule }, () => this.save())
}

pageParams.bindSubmit = async function () {
  // name, teacher, location, week, day, section, offset
  const { name, teacher, location } = this._tmp.ret

  if (Object.keys(this._tmp.ret).length !== 7 || !name || !teacher || !location) {
    wx.ooShowToast({ title: _string.error_incomplete })
    return
  }

  let newCourse = wx.ooUtil.copy(this._tmp.ret)

  if (newCourse.offset === 0) {
    wx.ooObjectPath.del(newCourse, 'offset')
  }

  const originSchedule = wx.ooService.edu._getSchoolSchedule() || []

  const eq = (_old, _new) => {
    return _old.week === _new.week && _old.day === _new.day && _old.section === _new.section
  }

  for (const course of originSchedule) {
    if (eq(course, newCourse)) {
      wx.ooShowToast({ title: _string.error_repeat })
      return
    }
  }

  let courses = []

  newCourse.random = Math.random()
  courses.push(newCourse)

  for (let i = 1; i < this._tmp.duration; i++) {
    let course = wx.ooUtil.copy(newCourse)
    course.section = course.section + i
    course.random = Math.random()
    courses.push(course)
  }

  this.save(courses)

  wx.ooShowToast({ title: this.data._string.success })
  await wx.ooSleep(1500)
  wx.switchTab({ url: '/pages/tabbar/schedule' })
}

pageParams.bindInputBlur = function (e) {
  const type = e.currentTarget.dataset.type,
    value = e.detail.value

  this._tmp.ret[type] = value
}

pageParams.bindTimePickerChange = function (e) {
  console.log('picker 新值为', e.detail.value)

  const [dayIndex, sectionIndex, halfIndex] = e.detail.value

  let timePickerText = [
    this.data.timePicker.range[0][dayIndex],
    this.data.timePicker.range[1][sectionIndex],
  ]

  let hideSectionPicker = false

  if (halfIndex !== 0) {
    hideSectionPicker = true
    timePickerText.push(this.data.timePicker.range[2][halfIndex])
  } else {
    this._tmp.duration = this._tmp.duration || 1

    // 根据当前选中的节数次序更新持续节数中的可选项
    let sectionPicker = this.data.sectionPicker
    sectionPicker.range = _string.form_duration_list.slice(0, 6 - sectionIndex)
    if (sectionPicker.value > sectionPicker.range.length - 1) {
      sectionPicker.value = sectionPicker.range.length - 1
    }
    this.setData({
      sectionPicker,
      sectionPickerText: sectionPicker.range[sectionPicker.value],
    })
  }

  timePickerText = timePickerText.join(' # ')

  this.setData({ hideSectionPicker, timePickerText })
  this._tmp.ret = Object.assign({}, this._tmp.ret, {
    day: dayIndex + 1,
    section: sectionIndex + 1,
    offset: halfIndex,
  })
}

pageParams.bindWeekPickerChange = function (e) {
  console.log('picker 新值为', e.detail.value)

  // 下标从 0 开始
  const [start, end, weekState] = e.detail.value

  const detailWeek = wx.ooString.component_schedule.detail_week,
    weekNum = [
      this.data.weekPicker.range[0][start],
      this.data.weekPicker.range[1][end],
    ]

  let weekPickerText = [
    detailWeek[0].replace('{0}', weekNum.join('-')),
  ]

  if (weekState !== 0) {
    weekPickerText.push(detailWeek[weekState])
  }

  weekPickerText = weekPickerText.join(' # ')

  this.setData({ weekPickerText })
  this._tmp.ret.week = [...weekNum, weekState].join(':')
}

pageParams.bindWeekPickerColumnChange = function (e) {
  console.log('修改的列为', e.detail.column, '值为', e.detail.value)

  const { column, value } = e.detail

  let weekPicker = wx.ooUtil.copy(this.data.weekPicker)
  weekPicker.value[column] = value

  // 开始周改变时结束周需要跟着变
  if (column === 0) {
    weekPicker.range[1] = weekPicker.range[0].slice(value)
    weekPicker.value[1] = 0
  }

  // 是否是同一周
  const isOneWeek = weekPicker.range[0][weekPicker.value[0]] === weekPicker.range[1][weekPicker.value[1]]

  // 如果是同一周 就不显示单双
  weekPicker.range[2] = isOneWeek ? _string.form_week_list.slice(0, 1) : _string.form_week_list
  weekPicker.value[2] =  isOneWeek ? 0 : weekPicker.value[2]

  this.setData({ weekPicker })
}

pageParams.bindSectionPickerChange = function (e) {
  console.log('picker 新值为', e.detail.value)

  let sectionPicker = this.data.sectionPicker
  sectionPicker.value = e.detail.value

  this.setData({
    sectionPicker,
    sectionPickerText: this.data.sectionPicker.range[e.detail.value],
  })

  this._tmp.duration = parseInt(e.detail.value) + 1
}

pageParams.save = function (courses) {
  courses = courses || []

  wx.ooSaveData({ edu: { schedule_custom: [...this.data.originCustomSchedule, ...courses] } })
  wx.ooService.edu.saveSchedule(wx.ooService.edu.renderSchedule())
}

Page(pageParams)
