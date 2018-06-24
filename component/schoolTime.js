import regeneratorRuntime from '../utils/libs/regenerator-runtime'

const EMOJI = ['😀', '😏', '😪', '😐', '😶'],
  PICKER_RANGE = [wx.ooString.component_schoolTime.grade, wx.ooString.component_schoolTime.semester]

const renderSchoolTime = (grade, semester) => `${PICKER_RANGE[0][grade - 1]} ${PICKER_RANGE[1][semester - 1]}`

let componentParams = {
  data: {
    picker: {
      range: PICKER_RANGE,
      value: [0, 0],
    },
    _string: wx.ooString.component_schoolTime,
  },
  methods: {},
}

componentParams.attached = function () {
  const { grade, semester } = wx.ooService.edu.getSchoolTime()

  let picker = wx.ooUtil.copy(this.data.picker)

  // 隐藏未达到的高年级
  picker.range[0] = picker.range[0].slice(0, grade)

  picker.value = [grade - 1, semester - 1]

  this._ooSetData({
    picker,
    schoolTime: renderSchoolTime(grade, semester),
  })

  this._ooTriggerEvent(picker.value)
}

componentParams.methods.bindPickerChange = function (e) {
  console.log('picker 新值为', e.detail.value)

  const [gradeIndex, semesterIndex] = e.detail.value

  this.setData({
    schoolTime: renderSchoolTime(gradeIndex + 1, semesterIndex + 1),
  })

  this._ooTriggerEvent(e.detail.value)
}

componentParams.methods._ooSetData = function (obj) {
  for (let key in obj) {
    // 同步更改 componentParams 里对应的值 这样重新打开本页时就可以保持最新状态
    wx.ooObjectPath.set(componentParams, `data.${key}`, obj[key])

    this.setData({ [key]: obj[key] })
  }
}

componentParams.methods._ooTriggerEvent = function (data) {
  this.triggerEvent('change', {
    value: {
      grade: data[0] + 1,
      semester: data[1] + 1,
      title: `${EMOJI[data[0]]} ${this.data.schoolTime}`,
    },
  })
}

Component(componentParams)
