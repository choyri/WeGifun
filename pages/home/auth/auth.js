let app = getApp(),
    pageParams = {
        data: {
            auth_state: app.lang.home_auth_state_no,
            hasAuth: false,
            text: {
                btn_title: app.lang.btn_title,
                description: app.lang.home_auth_description,
            },
        },
    };

pageParams.onReady = function () {
    if (! app.lang.isCN) {
        wx.setNavigationBarTitle({
            title: app.lang.authorization
        });
    }

    this.renderPage();
};

pageParams.renderPage = function (confirm = false) {
    if (app.cache.hasAuth === true || confirm) {
        this.setData({
            auth_state: app.lang.home_auth_state_yes,
            hasAuth: true,
        });
    }
};

pageParams.bindGetUserInfo = function (res) {
    if (res.detail.userInfo === undefined) {
        return;
    }

    console.log('已获得权限');
    app.event.emit('changeAuth');
    app.cache.hasAuth = true;
    this.renderPage(true);
};

Page(pageParams);
