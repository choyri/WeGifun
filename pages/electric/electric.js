let app = getApp(),
    request = require('../../utils/request.js'),
    pageParams = {
        data: {
            remain: app.lang.elec_remain_res.replace('{0}', 'N/A'),

            text_recharge: app.lang.elec_recharge,
            text_record: app.lang.elec_record,
            text_remain: app.lang.elec_remain
        }
    };

pageParams.onLoad = function () {
    app.event.on('settingDorm', this.renderPage, this);
};

pageParams.onReady = function () {
    wx.setNavigationBarTitle({
        title: app.lang.electric
    });

    this.renderPage();
};

pageParams.renderPage = function (newDorm) {
    let dorm = newDorm || app.cache.dataDorm || {};

    if (! dorm.id) {
        console.log('首次使用 进入设置页');
        wx.navigateTo({
            url: 'setting/setting'
        });
        return;
    }

    console.info('当前宿舍  fullName:', dorm.fullName, '  ID:', dorm.id);

    this.setData({
        dormName: dorm.fullName
    });

    request.getElecRemain({
        id: app.cache.stu.id,
        pwd: app.cache.stu.cardPwd,
        room: dorm.id
    }, (res) => {
        app.cache.elecRemain = res.data;

        this.setData({
            remain: app.lang.elec_remain_res.replace('{0}', res.data)
        });
    });
};

pageParams.navigateTo = function (e) {
    let target = e.currentTarget.dataset.target;

    wx.navigateTo({
        url: [target, target].join('/')
    });
};

Page(pageParams);
