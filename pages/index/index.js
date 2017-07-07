let app = getApp(),
    request = require('../../utils/request.js'),
    pageParams = {
        data: {
            // 课程块高度 # 课程块为绝对定位 # 通过设置其 top 进行上下定位 详见文档
            courseTop: ['placeholder', 0, 210, 425, 635, 850],
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

    if (app.cache.jw) {
        this.renderPage();
    } else {
        this.recovery();
    }
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

pageParams.renderPage = function () {
        // 当前周数 # 根据开学日期和当前日期计算 # 参考资料 http://t.cn/RyAh1MZ
    let currWeek = Math.ceil(((new Date()).getTime() - (new Date(app.cache.jw.termBegin)).getTime()) / 1000 / 3600 / 24 / 7),

        schedule = app.cache.jw.schedule,
        weekTitle = [],

        scheduleBg = {},
        lenPalette = this.palette.length,

        // 调色板下标
        index = 0;

    // 处理课表
    for (let key in schedule) {
        // 每一天

        // 将这一天对应的星期标题加到结果数组中 # 目的是如果某一天没课就可以将那一列隐藏
        weekTitle.push(app.lang.index_week_title[key - 1]);

        for (let subKey in schedule[key]) {
            // 每一大节

            for (let subSubKey in schedule[key][subKey]) {
                // 同一时间的课程 # 不区分单双周的话只有一门 否则多于一门

                let course = schedule[key][subKey][subSubKey],

                    // 课程周期范围
                    weekRange = course.week.split('-');

                // 课程是否可视
                course.display = true;

                // 特殊课程 # 只上一周
                if (weekRange[0] == weekRange[1]) {
                    if (currWeek == weekRange[0]) {
                        // 需要上课

                        // 如果和其他课程冲突 删除排在前面的课程 # 特殊课程优先级高 忽略其他课程
                        if (subSubKey != 0) {
                            schedule[key][subKey].splice(0, subSubKey);
                        }
                    } else {
                        // 不用上课 那就删除 # 结课后还是会存在于课表中

                        if (subSubKey == 0) {
                            // 同一时间只有一节 直接删除这段时间的课
                            delete schedule[key][subKey];
                        } else {
                            // 否则 删除自己
                            schedule[key][subKey].splice(subSubKey, 1);
                        }

                        continue;
                    }
                }

                // 单周时双周的课和双周时单周的课不显示
                if ((weekRange[2] === '1' && currWeek % 2 === 0) || (weekRange[2] === '2' && currWeek % 2 === 1)) {
                    course.display = false;
                    continue;
                }

                // 课程背景色 # 不在周期内的课程没有背景色 即默认的灰色
                if (currWeek >= weekRange[0] && currWeek <= weekRange[1]) {
                    // 当前周大于等于起始周 小于等于结束周

                    // 每门课一种颜色 # 以课程名字当索引
                    let bgKey = course.name;
                    scheduleBg[bgKey] = scheduleBg[bgKey] || this.palette[index++ % lenPalette];

                    course.bg = scheduleBg[bgKey];
                }

                // 当前课程是否连上 # 如 1-4 / 5-8 / 9-11 小节连上
                course.height = 0;
                let lastCourse = schedule[key][subKey - 1];
                if (lastCourse) {
                    // 如果上一大节有课 进行对比

                    let current = course.name + course.week + course.room,
                        last = '';

                    for (let tmpKey in lastCourse) {
                        last = lastCourse[tmpKey].name + lastCourse[tmpKey].week + lastCourse[tmpKey].room;

                        if (current == last) {
                            // 如果上一节课和当前课一样 即连上 修改上节的 height

                            // subkey 为 6 时[表示第 11 小节]设为 300  否则设为 410
                            // # 9-11 三小节所以是 300  1-4 和 5-8 四小节所以是 410 [加上中间间隔的 10]
                            lastCourse[tmpKey].height = subKey == 6 ? 300 : 410;

                            // 删除当前这节课
                            delete schedule[key][subKey];
                        }
                    }
                }
            }
        }

        // 删除特殊课程后 有可能出现空对象 此处将他们删除
        if (Object.getOwnPropertyNames(schedule[key]).length == 0) {
            delete schedule[key];
            weekTitle.splice(key - 1, 1);
        }
    }

    // 保存渲染后的课程信息
    this.setData({
        weekTitle,
        currWeek: app.lang.index_curr_week.replace('{0}', currWeek),
        schedule
    });
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
        course = this.data.schedule[dataSet.day][dataSet.course][dataSet.id],
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
