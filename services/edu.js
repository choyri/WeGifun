import regeneratorRuntime from '../utils/libs/regenerator-runtime'

// 调色板 # 课程块背景颜色 每门课一种 当前内置十二种
const SCHEDULE_PALETTE = [
  '#ff8a98', '#29b6f6', '#26a69a', '#7986cb', '#ff7043', '#4caf50',
  '#af5e53', '#48829e', '#ba68c8', '#eb586f', '#ffa726', '#bc8f8f',
]

// 课程时间表
const TIME_TABLE = [
    ['08:20', '09:05'],
    ['09:15', '10:00'],
    [
      ['10:20', '10:30'],
      ['11:05', '11:15'],
    ],
    [
      ['11:15', '11:25'],
      ['12:00', '12:10'],
    ],
    ['14:00', '14:45'],
    ['14:55', '15:40'],
    ['16:00', '16:45'],
    ['16:55', '17:40'],
    ['18:40', '19:25'],
    ['19:35', '20:20'],
    ['20:30', '21:15'],
  ],
  TIME_TABLE_PE = [
    ['18:00', '19:30'],
    ['19:30', '21:00'],
  ]

class Edu {
  static _currWeek = null

  static async getCurrWeek () {
    if (this._currWeek) {
      return this._currWeek
    }

    let startDate = this._getSchoolStartDate()

    if (!startDate) {
      startDate = await wx.ooRequest.getSchoolStartDate()
      if (!startDate) {
        return
      }
      this._saveSchoolStartDate(startDate)
    }

    // 7 * 24 * 60 * 60 * 1000 = 604800000
    return this._currWeek = Math.ceil(((new Date()).getTime() - (new Date(startDate)).getTime()) / 604800000)
  }

  static async fetchSchedule (schoolTime) {
    schoolTime = schoolTime || this.getSchoolTime()

    const rawSchedule = await wx.ooRequest.getEduSchedule(schoolTime)
    if (!rawSchedule) {
      return
    }

    wx.ooSaveData({ edu: { schedule: rawSchedule } })

    const schedule = this.renderSchedule(rawSchedule)
    this.saveSchedule(schedule)

    return true
  }

  static getSchedule () {
    return wx.ooCache.schedule && wx.ooCache.schedule.data || null
  }

  static renderSchedule (schedule, currWeek) {
    schedule = schedule || (wx.ooCache.edu && wx.ooCache.edu.schedule) || null

    if (!schedule) {
      throw new TypeError('缺少参数 schedule')
    }

    schedule = wx.ooUtil.copy(schedule)
    currWeek = parseInt(currWeek || this._currWeek)

    let res = [],
      scheduleBg = {},
      scheduleBgIndex = Math.floor(Math.random() * 12)

    let dayIndex,
      sectionIndex

    const _pushCourse = course => {
      res[dayIndex] = res[dayIndex] || {
        unique: `week${currWeek}_day${course.day}`,
        index: dayIndex,
        data: [],
      }

      res[dayIndex].data[sectionIndex] = res[dayIndex].data[sectionIndex] || {
        unique: `week${currWeek}_day${course.day}_section${course.section}`,
        index: sectionIndex,
        data: [],
      }

      res[dayIndex].data[sectionIndex].data.push({
        data: course,
        index: res[dayIndex].data[sectionIndex].data.length,
        unique: `week${currWeek}_day${course.day}_section${course.section}_course${res[dayIndex].data[sectionIndex].data.length}`,
      })
    }

    for (let course of schedule) {
      // 课程数据的排序从一开始 减一以配合数组
      dayIndex = course.day - 1
      sectionIndex = course.section - 1

      // 是否需要上课
      course.attend = true

      // 课程是否可视 # 同一时间有多节课的时候隐藏不相干的课
      course.display = true

      // 课程周期范围
      course.weekRange = course.week.split(':').map(item => parseInt(item))

      const outOfRange = currWeek < course.weekRange[0] || currWeek > course.weekRange[1] || false

      // 单周时双周的课 & 双周时单周的课 & 不在周期内的课 不需要上
      if ((course.weekRange[2] === 1 && currWeek % 2 === 0) || (course.weekRange[2] === 2 && currWeek % 2 === 1) || outOfRange) {
        course.attend = false
      }

      // 同一时间段不同周有不同的课 # e.g. 1-15周(单),2-16周(双) / 1-3周(单),4-16周
      const currSection = res[dayIndex] && res[dayIndex].data[sectionIndex] || null
      if (currSection && currSection.data.length > 0) {
        // 当前课程不在周期内的话 跳过后续处理
        if (outOfRange) {
          // 已经有隔壁课程了 当前课程既然不在周期内 那就直接跳过
          continue
        }

        let affectedBySiblingCourse = false

        for (let i = 0; i < currSection.data.length; i++) {
          const siblingCourse = currSection.data[i].data

          // 一般情况下 隔壁课程需要上 那就说明当前课程不用上 # 此时 course.attend 是 false
          // 不一般的情况下 特殊课程 不考虑
          if (siblingCourse.attend && (siblingCourse.display || siblingCourse.forwardFrom !== undefined)) {
            affectedBySiblingCourse = true
            continue
          }

          // 如果隔壁课程不用上那就隐藏它
          if (siblingCourse.attend === false) {
            res[dayIndex].data[sectionIndex].data[i].data.display = false
          }
        }

        // 如果已有需要上的隔壁课程 跳过当前课程
        if (affectedBySiblingCourse) {
          continue
        }
      }

      // 连上课程
      const prevSectionIndex = sectionIndex - 1,
        prevSection = res[dayIndex] && res[dayIndex].data[prevSectionIndex] || null

      let affectedByPrevSection = false

      // 如果当前课程偏移 那么即使前一节有课也不管
      if (prevSection && course.offset != 2) {
        const currValue = course.name + course.teacher + course.location + course.attend

        for (const _prevCourse of prevSection.data) {
          const prevCourse = _prevCourse.data,
            prevValue = prevCourse.name + prevCourse.teacher + prevCourse.location + prevCourse.attend

          // 如果前一节课偏移就不要
          if (prevCourse.offset == 1) {
            continue
          }

          // 如果前一节课和本节课不同 跳过
          if (prevValue !== currValue) {
            continue
          }

          // 如果两节课的周期不同 跳过
          if (prevCourse.weekRange[1] < course.weekRange[0] || prevCourse.weekRange[0] > course.weekRange[0]) {
            continue
          }

          // 此时 前一节课和本节课相同 连上课程

          // 隐藏当前课程
          course.display = false

          // 给当前课程打标记 第几节开始的课 # 因为值可能是数字零 所以此处不能用 || 的写法
          course.forwardFrom = prevCourse.forwardFrom !== undefined ? prevCourse.forwardFrom : prevSectionIndex

          // 修改连上课程的高度 # 因为前面那个时间段可能不止一门课 所以用循环找出目标
          const headSection = res[dayIndex].data[course.forwardFrom]
          for (const _headCourse of headSection.data) {
            const headCourse = _headCourse.data

            if (headCourse.name !== course.name) {
              continue
            }

            // 每个课程块高度 200  间隔 10 # 例如 两节连上的话高度就为 410

            // 偏移课程高度为 100 # 第六大节如果是连上课程 说明和第五大节连上 目前来看只有 9-11 的情况 所以高度也为 100
            const _offset = (headCourse.offset || course.offset || course.section == 6) ? 100 : 200

            res[dayIndex].data[course.forwardFrom].data[_headCourse.index].data
              .height = (sectionIndex - course.forwardFrom) * 210 + _offset

            break
          }

          affectedByPrevSection = true

          break
        }

        if (affectedByPrevSection) {
          // 后面不用判断 直接打入课程 进行下一轮循环
          _pushCourse(course)
          continue
        }
      }

      // 处理节次偏移
      if (course.offset) {
        course.top = course.offset == 1 ? 0 : 100
        course.height = 100
      }

      // 课程背景色 # 不用上的课没有背景色 即默认的灰色
      if (outOfRange === false && course.attend) {
        // 每门课一种颜色 # 以课程名字当索引
        const bgKey = course.name
        scheduleBg[bgKey] = scheduleBg[bgKey] || SCHEDULE_PALETTE[scheduleBgIndex++ % SCHEDULE_PALETTE.length]

        course.bg = scheduleBg[bgKey]
      }

      // 循环结束 打入课程
      _pushCourse(course)
    }

    // 周一到周五 即使某一天没课也给其赋空值
    for (let i = 0; i < 5; i++) {
      res[i] = res[i] || {}
    }

    return res
  }

  static saveSchedule (data) {
    wx.ooEvent.emit('updateSchedule', data)
    wx.ooSaveData({ schedule: { data, week: this._currWeek } })
  }

  static async updateSchedule () {
    if (!this.getSchedule()) {
      console.log('课表数据不存在')
      return
    }

    if (this._currWeek === null) {
      console.log('当前周数不存在')
      return
    }

    if (this._currWeek === this._getScheduleWeek()) {
      console.log('周数无变化')
      return
    }

    console.log('周数改变 重新渲染课表')

    const schedule = await this.renderSchedule()
    this.saveSchedule(schedule)
  }

  static getScheduleBg () {
    return wx.ooCache.schedule && wx.ooCache.schedule.bg || { path: '', style: 0 }
  }

  static saveScheduleBg (value) {
    let bg = this.getScheduleBg()
    Object.assign(bg, value)

    wx.ooEvent.emit('updateScheduleBg', bg)
    wx.ooSaveData({ schedule: { bg } })
  }

  static _getScheduleWeek () {
    return wx.ooCache.schedule && wx.ooCache.schedule.week || 1
  }

  static _getSchoolStartDate () {
    return wx.ooCache.edu && wx.ooCache.edu.startDate || null
  }

  static _saveSchoolStartDate (startDate) {
    wx.ooSaveData({ edu: { startDate } })
  }

  static getSchoolTime () {
    const _DATE = new Date(),
      CURR_YEAR = _DATE.getFullYear(),
      CURR_MONTH = _DATE.getMonth() + 1,
      _USER_ACCOUNT = wx.ooService.user.getAccount(),
      COLLEGE = _USER_ACCOUNT.id.substr(0, 2),
      ENROLLMENT_YEAR = 2000 + parseInt(_USER_ACCOUNT.id.substr(2, 2))

    let res = {
      grade: CURR_YEAR - ENROLLMENT_YEAR,
    }

    if (CURR_MONTH > 8) {
      res.grade++
    }

    // 设置最高年级 # 建筑大五 其他大四
    if (res.grade > 4) {
      res.grade = COLLEGE == '11' ? 5 : 4
    }

    // 学期
    res.semester = CURR_MONTH < 3 || CURR_MONTH > 8 ? 1 : 2

    return res
  }

  static async fetchScore (schoolTime) {
    return await wx.ooRequest.getEduScore(schoolTime)
  }

  static getTimeTable (course) {
    // 大节计数
    const sectionCount = (course.height === undefined || course.height == 100) ? 1 : Math.floor(course.height / 200)

    // 开始小节的下标
    const startSmallSection = course.section * 2 - 1

    // 大节组 # 储存课程下标
    let sectionGroup = []
    for (let i = 0; i < sectionCount; i++) {
      const index = startSmallSection + 2 * i
      sectionGroup.push({ start: index, end: index + 1 })
    }

    // 课程偏移 # sectionGroup 数组头部就是需要调整的值 所以直接指定下标为 0
    if (course.offset == 1) {
      // 偏上的就将结束下标减一
      sectionGroup[0].end--
    } else if (course.offset == 2) {
      // 偏下的就将开始下标加一
      sectionGroup[0].start++
    }

    // 带有小节的连上课程 类似于 3 小节 # e.g. 9-11
    if (course.height && course.height % 200 > 100) {
      // 最后一小节的下标
      const index = (course.section + sectionCount - 1) * 2 + 1

      // 如果是偏移课程 以偏移小节开始 普通大节结束 # 这种排课暂时未遇见 # e.g. 6-8
      let tmp = course.offset == 2 ? 1 : 0

      sectionGroup.push({ start: index, end: index + tmp })
    }

    // 是否较快下课
    const isFast = course.location.match(/二教|实验|室/g) === null

    // 是否是体育课 # 高尔夫球导程是选修课 非体育课 按照正常课程时间上课
    const isPE = course.name.match(/球|健美|体育|武术|太极|散打|游泳/g) && course.name !== '高尔夫球导程' || false

    let res = []

    for (const section of sectionGroup) {
      let startTime, endTime

      if (section.start === 11 && section.end === 12) {
        // 第 11 12 节的体育课
        startTime = TIME_TABLE_PE[1][0]
        endTime = TIME_TABLE_PE[1][1]
      } else if (section.start === 9 && section.end === 10 && isPE) {
        // 第 9 10 节的体育课
        startTime = TIME_TABLE_PE[0][0]
        endTime = TIME_TABLE_PE[0][1]
      } else {
        // 普通课程
        startTime = TIME_TABLE[section.start - 1][0]
        endTime = TIME_TABLE[section.end - 1][1]

        // 如果是第 3 4 节开始的课程 还需要再细分
        if (section.start === 3 || section.start === 4) {
          startTime = isFast ? startTime[0] : startTime[1]
          endTime = isFast ? endTime[0] : endTime[1]
        }
      }

      res.push(`${startTime}-${endTime}`)
    }

    return res.join(' ')
  }
}

export default Edu
