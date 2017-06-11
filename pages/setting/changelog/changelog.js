let app = getApp(),
    pageParams = {};

pageParams.onLoad = function () {
    wx.setNavigationBarTitle({
        title: app.lang.setting_changelog
    });

    this.setData({
        changelog: app.lang.changelog
    });
};

Page(pageParams);
