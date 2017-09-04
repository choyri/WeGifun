let app = getApp(),
    pageParams = {
        data: {
            text_about: app.lang.setting_about,
            text_authorization: app.lang.setting_authorization,
            text_changelog: app.lang.setting_changelog,
            text_edu: app.lang.edu,
            text_exit: app.lang.setting_exit,
            text_feedback: app.lang.setting_feedback,
            isLogin: (app.cache.stu ? true : false),
            wxSettingCanUse: (wx.openSetting ? true : false)
        }
    };

pageParams.onReady = function () {
    wx.setNavigationBarTitle({
        title: app.lang.home_setting
    });

    this.renderPage();
};

pageParams.renderPage = function() {
    if (app.cache.globalRefresh) {
        this.setData({
            isLogin: app.cache.stu ? true : false
        });
    }
};

pageParams.bindContact = function () {
    // 基础库 1.1.0 开始支持
    if (! wx.canIUse || ! wx.canIUse('button.open-type.contact')) {
        app.showErrModal(app.lang.wx_version_warn);
    }

    console.log('进入客服会话');
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
                app.cache = {
                    globalRefresh: true,
                    userWxInfo: app.cache.userWxInfo
                };
                app.event.emit('exit');
                wx.switchTab({
                    url: '/pages/home/home'
                });
            }
        }
    });
};

pageParams.bindWxSetting = function () {
    wx.openSetting({
        success() {
            console.info('授权状态已变更');
            app.event.emit('changeAuth');
        }
    });
};

Page(pageParams);
