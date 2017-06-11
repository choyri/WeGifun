let app = getApp(),
    pageParams = {
        data: {
            quote: app.config.quote,
            egg_display: false
        },
        countClick: 0
    };

pageParams.onLoad = function () {
    wx.setNavigationBarTitle({
        title: app.lang.setting_about
    });

    this.setData({
        text_open_source: app.lang.about_open_source,
        text_security: app.lang.about_security,
        security_content: app.lang.about_security_content,
        text_gratitude: app.lang.about_gratitude,
        version: app.config.version
    });
};

pageParams.bindClick = function () {
    if (++this.countClick == 5) {
        if (wx.vibrateLong) {
            wx.vibrateLong();
        }

        this.setData({
            egg_display: true
        });
    }
};

pageParams.bindCopy = function () {
    if (wx.setClipboardData) {
        wx.setClipboardData({
            data: 'http://t.cn/RSpL1p5',
            success(res) {
                wx.showToast({
                    title: app.lang.about_copy_success,
                });
            }
        });
    }
};

Page(pageParams);
