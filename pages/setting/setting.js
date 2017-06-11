let app = getApp(),
    pageParams = {};

pageParams.onLoad = function () {
    wx.setNavigationBarTitle({
        title: app.lang.home_setting
    });

    let isLogin = app.cache.userInfoStu ? true : false,
        wxSettingCanUse = wx.openSetting ? true : false;

    this.setData({
        isLogin,
        wxSettingCanUse,
        text_jw: app.lang.setting_jw,
        text_authorization: app.lang.setting_authorization,
        text_feedback: app.lang.setting_feedback,
        text_about: app.lang.setting_about,
        text_changelog: app.lang.setting_changelog,
        text_exit: app.lang.setting_exit
    });
};

pageParams.bindExit = function () {
    wx.showModal({
        title: app.lang.modal_title,
        content: app.lang.setting_exit_content,
        confirmText: app.lang.modal_confirm,
        cancelText: app.lang.modal_cancel,
        success(res) {
            if (res.confirm) {
                wx.clearStorage();
                delete app.cache.userInfoStu;
                app.event.emit('exit');
                wx.switchTab({
                    url: '/pages/home/home',
                });
            }
        }
    });
};

pageParams.bindWxSetting = function () {
    wx.openSetting({
        success(res) {
            app.getWxInfo(function () {
                app.event.emit('changeAuth');
            });
        }
    });
};

Page(pageParams);
