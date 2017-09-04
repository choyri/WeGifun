let app = getApp(),
    eduService = require('../../utils/eduService.js'),
    schedule = app.cache.dataSchedule || {},
    pageParams = {
        data: {
            // 课程块高度 # 课程块为绝对定位 # 通过设置其 top 进行上下定位 详见文档
            courseTop: ['>_< 我是占位符', 0, 210, 420, 630, 840],

            currWeek: app.lang.index_curr_week.replace('{0}', (schedule.currWeek || 0)),
            schedule: schedule.schedule || null,
            weekTitle: schedule.weekTitle || app.lang.index_week_title
        }
    };

pageParams.onLoad = function () {
    app.event.on('exit', this.setNewData, this);
    app.event.on('updateSchedule', this.renderPage, this);
};

pageParams.onReady = function () {
    if (! app.lang.isCN) {
        wx.setNavigationBarTitle({
            title: app.lang.title
        });
    }

    if (app.cache.edu) {
        this.renderPage();
        return;
    }

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
};

pageParams.onUnload = function () {
    app.event.off(this);
};

pageParams.renderPage = function (refresh = false) {
    // 当前周数 # 根据开学日期和当前日期计算 # 参考资料 http://t.cn/RyAh1MZ
    let currWeek = Math.ceil(((new Date()).getTime() - (new Date(app.cache.edu.termBegin)).getTime()) / 604800000);     // 1000 * 3600 * 24 * 7

    if (currWeek == schedule.currWeek && ! refresh) {
        console.log('直接渲染课表缓存');
        return;
    }

    console.log(refresh ? '强制刷新课表' : '周数变动');
    console.info('之前周数：', schedule.currWeek, '当前周数：', currWeek);

    let res = {};

    if (app.cache.edu.schedule.length !== 0) {
        res = eduService.renderSchedule(currWeek, app.cache.edu.schedule);
        for (let i = res.weekTitle.length - 1; i >= 0; i--) {
            res.weekTitle[i] = app.lang.index_week_title[res.weekTitle[i]];
        }
    } else {
        res.schedule = null;
        res.weekTitle = app.lang.index_week_title;
    }

    res.currWeek = currWeek;

    this.setNewData({
        currWeek,
        schedule: res.schedule,
        weekTitle: res.weekTitle
    });

    app.saveData({
        dataSchedule: res
    });
};

pageParams.setNewData = function (data = null) {
    this.setData({
        currWeek: app.lang.index_curr_week.replace('{0}', (data ? data.currWeek : 0)),
        schedule: (data ? data.schedule : null),
        weekTitle: (data ? data.weekTitle : app.lang.index_week_title)
    });
};

pageParams.showDetail = function (e) {
    let dataSet = e.currentTarget.dataset,

        course = this.data.schedule[dataSet.day].data[dataSet.section].data[dataSet.course].data,
        weekArr = [
            '',
            ', ' + app.lang.index_detail_odd,
            ', ' + app.lang.index_detail_even
        ],
        weekRange = course.week.split('-'),
        week = app.lang.index_detail_week.replace('{0}', weekRange[0] + '-' + weekRange[1]) + weekArr[weekRange[2]];

    wx.showModal({
        title: app.lang.index_schedule_detail_title,
        content: course.name + ' / ' + course.teacher + ' / ' + course.room + ' / ' + week,
        confirmText: app.lang.modal_confirm,
        showCancel: false
    });

    // 基础库 1.2.0 开始支持
    if (wx.vibrateShort) {
        wx.vibrateShort();
    }
};

Page(pageParams);
