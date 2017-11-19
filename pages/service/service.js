let app = getApp(),
    pageParams = {
        data: {
            text_card: app.lang.card,
            text_edu: app.lang.edu,
            tip: app.lang.service_tip
        }
    };

pageParams.onLoad = function () {
    app.event.on('loginSuccess', this.renderPage, this);
};

pageParams.onReady = function () {
    wx.setNavigationBarTitle({
        title: app.lang.service
    });

    this.renderPage();
};

pageParams.onUnload = function () {
    app.event.off(this);
};

pageParams.renderPage = function () {
    let action = {
            true: 'edit',
            false: 'add'
        },
        bind = {
            true: app.lang.service_bind,
            false: app.lang.service_unbind
        },
        userInfo = app.cache.dataUserInfo,
        is_bind_card = userInfo.isBindCard || false,
        is_bind_edu = userInfo.isBindEdu || false;

    console.info('教务管理系统已绑定？', is_bind_edu, '校园卡已绑定？', is_bind_card);

    this.setData({
        card_bind_status: bind[is_bind_card],
        card_action: action[is_bind_card],
        edu_bind_status: bind[is_bind_edu],
        edu_action: action[is_bind_edu]
    });
};

pageParams.bindJump = function (e) {
    app.cache.loginParams = {
        action: e.currentTarget.dataset.action,
        type: e.currentTarget.id
    };

    wx.navigateTo({
        url: '/pages/login/login'
    });
};

Page(pageParams);
