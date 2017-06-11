let app = getApp(),
    request = require('../../utils/request.js'),
    pageParams = {};

pageParams.onLoad = function () {
    wx.setNavigationBarTitle({
        title: app.lang.home_card
    });

    this.setData({
        text_balance: app.lang.card_balance_label,
        text_confirm: app.lang.card_record_btn,
        text_witticism: app.lang.card_witticism
    });

    this.renderPage();
};

pageParams.renderPage = function () {
    let that = this,
        balance = 'N/A';

    request.getCardBalance({
        id: app.cache.userInfoStu.id,
        pwd: app.cache.userInfoStu.cardPwd
    }, function (res) {
        if (res.status == 200) {
            balance = '￥' + res.data;
        } else {
            app.showErrModal(res.msg);
        }
    }, function () {
        that.setData({
            balance
        });
    });
};

pageParams.toRecord = function () {
    wx.navigateTo({
        url: 'record/record'
    });
};

Page(pageParams);
