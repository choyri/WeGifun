let app = getApp(),
    pageParams = {
        data: {
            egg_display: false,
            quote: app.config.quote,
            qqGroup: app.config.qqGroup,
            text_communication: app.lang.about_communication,
            communication_content: app.lang.about_communication_content,
            text_gratitude: app.lang.about_gratitude,
            text_open_source: app.lang.about_open_source,
            text_security: app.lang.about_security,
            security_content: app.lang.about_security_content,
            version: app.config.version
        },
        countClick: 0
    };

pageParams.onReady = function () {
    wx.setNavigationBarTitle({
        title: app.lang.setting_about
    });
};

pageParams.bindClick = function () {
    if (++this.countClick === 5) {
        // 基础库 1.2.0 开始支持
        if (wx.vibrateLong) {
            wx.vibrateLong();
        }

        this.setData({
            egg_display: true
        });
    }
};

pageParams.bindCopy = function (e) {
    // 基础库 1.1.0 开始支持
    if (wx.setClipboardData) {
        wx.setClipboardData({
            data: e.currentTarget.dataset.text || '',
            success() {
                wx.showToast({
                    title: app.lang.about_copy_success
                });
            }
        });
    }
};

Page(pageParams);
