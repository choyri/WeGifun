let app = getApp(),
    request = require('../../utils/request.js'),
    pageParams = {
        data: {
            // 课程块高度 # 课程块为绝对定位 # 通过设置其 top 进行上下定位 详见文档
            courseTop: ['placeholder', 0, 210, 420, 630, 840],

            currWeek: app.lang.index_curr_week.replace('{0}', (app.cache.dataCurrWeek || 0)),
            schedule: app.cache.dataSchedule || null,
            weekTitle: app.cache.dataWeekTitle || app.lang.index_week_title
        },

        // 调色板 # 课程背景颜色 每门课一种 当前内置十种
        palette: ['#3399CC', '#669999', '#CC9966', '#FF6666', '#666699', '#33CC99', '#996666', '#FF99CC', '#99CC33', '#99CCFF']
    };

pageParams.onLoad = function () {
    app.event.on('jwUpdate', this.renderPage, this);
    app.event.on('exit', this.recovery, this)

    wx.setNavigationBarTitle({
        title: app.lang.title,
    });

    this.renderPage();
};

pageParams.onReady = function () {
    if (!app.cache.jw) {
        wx.showModal({
            title: app.lang.modal_title,
            content: app.lang.index_schedule_null,
            confirmText: app.lang.modal_confirm,
            cancelText: app.lang.modal_cancel,
            success(res) {
                if (res.confirm) {
                    wx.navigateTo({
                        url: '/pages/login/login'
                    });
                }
            }
        });
    }
};

pageParams.onUnload = function () {
    app.event.off(this);
};

pageParams.renderPage = function (refresh = false) {
    if (!app.cache.jw) {
        return;
    }

    // 当前周数 # 根据开学日期和当前日期计算 # 参考资料 http://t.cn/RyAh1MZ
    let currWeek = Math.ceil(((new Date()).getTime() - (new Date(app.cache.jw.termBegin)).getTime()) / 1000 / 3600 / 24 / 7);

    if (currWeek != app.cache.dataCurrWeek || refresh) {
        let res = this.parseSchedule(currWeek);

        this.setData({
            currWeek: app.lang.index_curr_week.replace('{0}', currWeek),
            schedule: res.schedule,
            weekTitle: res.weekTitle
        });

        app.saveData({
            dataCurrWeek: currWeek,
            dataSchedule: res.schedule,
            dataWeekTitle: res.weekTitle
        });
    }
};

pageParams.parseSchedule = function (currWeek) {
    let schedule = app.cache.jw.schedule,
        weekTitle = [],

        scheduleBg = {},
        lenPalette = this.palette.length,

        // 调色板下标
        index = 0;

    // 每天
    for (let day of schedule) {
        day.unique = currWeek + '_' + day.unique;

        // 将这一天对应的星期标题加到结果数组中 # 目的是如果某一天没课就可以将那一列隐藏
        weekTitle.push(app.lang.index_week_title[day.index - 1]);

        // 节次下标 # 用于定位上一大节课
        let sectionIndex = 0;

        // 每节次
        for (let section of day.data) {
            section.unique = currWeek + '_' + section.unique;

            // 每门 # 不区分单双周的话只有一门 否则多于一门
            for (let course of section.data) {
                course.unique = currWeek + '_' + course.unique;

                let courseData = course.data,

                    // 课程周期范围
                    weekRange = courseData.week.split('-');

                // 课程是否可视
                courseData.display = true;

                // 周期内的课程状态
                courseData.state = true;

                // 单周时双周的课和双周时单周的课不用上
                if ((weekRange[2] === '1' && currWeek % 2 === 0) || (weekRange[2] === '2' && currWeek % 2 === 1)) {
                    courseData.state = false;
                }

                // 有同一时间的课 # 单双周
                if (course.index !== 0) {
                    let flag = false;
                    for (let i = 0; i < course.index; i++) {
                        let siblingCourseData = section.data[i].data;

                        // 如果其他课程需要上 或者他们是连上课程 那就说明当前课程不用上
                        if ((siblingCourseData.display === true && siblingCourseData.state === true) || siblingCourseData.forwardFrom !== undefined) {
                            courseData.display = false;
                            flag = true;
                            continue;
                        }

                        // 因单双周而不用上的课 同一时间有其他课程要上的时候 这节课需要隐藏
                        if (siblingCourseData.state === false) {
                            siblingCourseData.display = false;
                            continue;
                        }
                    }

                    // 如果已有需要上的课程 即可跳过本次循环
                    if (flag) {
                        continue;
                    }
                }

                // 处理连上课程
                let previousSectionIndex = sectionIndex - 1,
                    previousSection = day.data[previousSectionIndex];
                if (previousSection) {
                    let currentValue = courseData.name + courseData.week + courseData.room,
                        previousValue = '',
                        flag = false;

                    for (let tmpCourse of previousSection.data) {
                        let previousCourseData = tmpCourse.data;

                        previousValue = previousCourseData.name + previousCourseData.week + previousCourseData.room;

                        // 如果前一节需要上的课和本节课相同 或者前一节是连上课程
                        if ((previousCourseData.display === true && currentValue === previousValue) || previousCourseData.forwardFrom !== undefined) {
                            // 隐藏当前课程
                            courseData.display = false;

                            // 给当前课程打标记 第几节开始的课
                            courseData.forwardFrom = previousCourseData.forwardFrom !== undefined ? previousCourseData.forwardFrom : previousSectionIndex;

                            // 修改连上课程的高度
                            let startSection = day.data[courseData.forwardFrom];
                            for (let tmpCourse of startSection.data) {
                                // 因为前面那个时间段可能不止一门课 所以用循环找出目标

                                let startCourseData = tmpCourse.data;
                                if (startCourseData.display === true) {
                                    // 每个课程块高度 200  间隔 10 # 例如 两节连上的话高度就为 410
                                    startCourseData.height = (sectionIndex - courseData.forwardFrom) * 210 + 200;
                                    continue;
                                }
                            }

                            // 完成操作 跳出循环
                            flag = true;
                            continue;
                        }
                    }

                    // 如果当前课程是连上课程 即可跳过本次循环
                    if (flag) {
                        continue;
                    }
                }

                // 课程背景色 # 不在周期内的课程没有背景色 即默认的灰色
                if (currWeek >= weekRange[0] && currWeek <= weekRange[1] && courseData.state) {
                    // 当前周大于等于起始周 小于等于结束周

                    // 每门课一种颜色 # 以课程名字当索引
                    let bgKey = courseData.name;
                    scheduleBg[bgKey] = scheduleBg[bgKey] || this.palette[index++ % lenPalette];

                    courseData.bg = scheduleBg[bgKey];
                }
            }

            // 节次结束 下标自增
            sectionIndex++;
        }
    }

    return {
        schedule,
        weekTitle
    };
};

pageParams.recovery = function () {
    this.setData({
        weekTitle: app.lang.index_week_title,
        currWeek: app.lang.index_curr_week.replace('{0}', 0),
        schedule: null
    });
};

pageParams.showDetail = function (e) {
    let dataSet = e.currentTarget.dataset,
        course = this.data.schedule[dataSet.day].data[dataSet.section].data[dataSet.course].data,
        weekRange = course.week.split('-'),
        weekArr = ['', ', ' + app.lang.index_detail_odd, ', ' + app.lang.index_detail_even];

    let week = app.lang.index_detail_week.replace('{0}', weekRange[0] + '-' + weekRange[1]) + weekArr[weekRange[2]];

    wx.showModal({
        title: app.lang.index_schedule_detail_title,
        content: course.name + ' / ' + course.teacher + ' / ' + course.room + ' / ' + week,
        confirmText: app.lang.modal_confirm,
        showCancel: false
    });

    if (wx.vibrateShort) {
        wx.vibrateShort();
    }
};

Page(pageParams);
