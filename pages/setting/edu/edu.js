let app = getApp(),
    eduService = require('../../../utils/eduService.js'),
    request = require('../../../utils/request.js'),
    pageParams = {
        data: {
            text_update_shcedule: app.lang.setting_edu_update_schedule
        }
    };

pageParams.onReady = function () {
    wx.setNavigationBarTitle({
        title: app.lang.edu
    });

    this.renderPage(app.cache.edu.updateTime);
};

pageParams.renderPage = function (data) {
    this.setData({
        updateTime: app.lang.setting_edu_last_update.replace('{0}', app.util.formatTime(data))
    });
};

pageParams.bindUpdate = function () {
    request.getEduSchedule({
        id: app.cache.stu.id,
        pwd: app.cache.stu.eduPwd
    }, (res) => {
        let edu = eduService.processSchedule(res.data);

        this.renderPage(edu.updateTime);
        app.saveData({
            edu
        });

        app.event.emit('updateSchedule', true);

        wx.switchTab({
            url: '/pages/index/index'
        });
    }, (res) => {
        app.showErrModal(res.msg);
    });
};

Page(pageParams);
