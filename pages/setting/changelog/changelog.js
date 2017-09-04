let app = getApp(),
    pageParams = {
        data: {
            changelog: app.lang.changelog
        }
    };

pageParams.onReady = function () {
    wx.setNavigationBarTitle({
        title: app.lang.setting_changelog
    });
};

Page(pageParams);
