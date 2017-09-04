let app = getApp(),
    request = require('../../utils/request.js'),
    pageParams = {
        data: {
            balance: 'N/A',
            text_confirm: app.lang.card_record,
            text_balance: app.lang.card_balance,
            text_witticism: app.lang.card_witticism
        }
    };

pageParams.onReady = function () {
    wx.setNavigationBarTitle({
        title: app.lang.card
    });

    this.renderPage();
};

pageParams.renderPage = function () {
    request.getCardBalance({
        id: app.cache.stu.id,
        pwd: app.cache.stu.cardPwd
    }, (res) => {
        this.setData({
            balance: '￥' + res.data
        });
    });
};

pageParams.toRecord = function () {
    wx.navigateTo({
        url: 'record/record'
    });
};

Page(pageParams);
