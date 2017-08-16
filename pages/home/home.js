let app = getApp(),
    pageParams = {
        data: {
            text_card: app.lang.home_card,
            text_setting: app.lang.home_setting,
            stuId: (app.cache.userInfoStu ? app.lang.home_stuid.replace('{0}', app.cache.userInfoStu.id) : app.lang.home_stuid_null),
            userInfo: app.cache.dataUserInfo || null
        }
    };

pageParams.onLoad = function () {
    app.event.on('changeAuth', this.getUserInfoWx, this);
    app.event.on('exit', this.renderPage, this);
    app.event.on('loginSuccess', this.renderPage, this);

    wx.setNavigationBarTitle({
        title: app.lang.title,
    });

    this.renderPage();

    if (! app.cache.userInfoWx && app.cache.authUserInfo !== false) {
        console.log('开始首次授权');
        this.getUserInfoWx();
    }
};

pageParams.onUnload = function () {
    app.event.off(this);
};

pageParams.renderPage = function (refresh = false) {
    if (app.cache.dataUserInfo && ! refresh) {
        console.log('直接渲染用户信息缓存');
        return;
    }

    let userInfo = {
            isBindCard: ((app.cache.userInfoStu && app.cache.userInfoStu.cardPwd) ? true : false)
        };

    this.updateUserInfoWx(userInfo, app.cache.userInfoWx);

    this.setData({
        userInfo
    });

    app.saveData({
        dataUserInfo: userInfo
    });
};

pageParams.getUserInfoWx = function () {
    console.log('开始获取 userInfoWx');
    app.getUserInfoWx(() => {
        this.renderPage(true);
    });
};

pageParams.updateUserInfoWx = function (origin, userInfoWx = null) {
    origin.avatar = userInfoWx ? userInfoWx.avatarUrl : '/images/avatar.png';
    origin.nickname = userInfoWx ? userInfoWx.nickName : app.lang.home_default_nickname;
};

Page(pageParams);
