let app = getApp(),
    jwHelper = require('../../../utils/jwHelper.js'),
    request = require('../../../utils/request.js'),
    pageParams = {};

pageParams.onLoad = function () {
    wx.setNavigationBarTitle({
        title: app.lang.setting_jw
    });

    this.setData({
        text_update_shcedule: app.lang.setting_jw_update_schedule,
        updateTime: this.renderUpdateTime(app.cache.jw.updateTime)
    });
};

pageParams.bindUpdate = function () {
    let that = this;

    request.getJwSchedule({
        id: app.cache.userInfoStu.id,
        pwd: app.cache.userInfoStu.jwPwd
    }, function (res) {
        if (res.status == 200) {
            let jw = jwHelper.processSchedule(res.data);

            app.saveData({
                jw
            });
            app.event.emit('jwUpdate', true);

            that.setData({
                updateTime: that.renderUpdateTime(jw.updateTime)
            });

            wx.switchTab({
                url: '/pages/index/index',
            });
        } else {
            app.showErrModal(res.msg);
        }
    })
};

pageParams.renderUpdateTime = function (data) {
    return app.lang.setting_jw_last_update.replace('{0}', app.util.formatTime(data));
};

Page(pageParams);
