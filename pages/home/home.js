let app = getApp(),
    pageParams = {};

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

pageParams.renderPage = function () {
    let userInfo = {
            isBindCard: false,
            stuid: app.lang.home_stuid_null
        };

    let stuInfo = app.cache.userInfoStu;
    if (stuInfo) {
        userInfo.stuid = app.lang.home_stuid.replace('{0}', stuInfo.id);

        if (stuInfo.cardPwd) {
            userInfo.isBindCard = true;
        }
    }

    this.updateUserInfoWx(userInfo, app.cache.userInfoWx);

    this.setData({
        userInfo,
        text_card: app.lang.home_card,
        text_setting: app.lang.home_setting
    });
};

pageParams.getUserInfoWx = function () {
    console.log('开始获取 userInfoWx');
    app.getUserInfoWx(() => {
        let userInfo = this.data.userInfo;
        this.updateUserInfoWx(userInfo, app.cache.userInfoWx);
        this.setData({
            userInfo
        });
    });
};

pageParams.updateUserInfoWx = function (origin, userInfoWx = null) {
    origin.avatar = userInfoWx ? userInfoWx.avatarUrl : '/images/avatar.png';
    origin.nickname = userInfoWx ? userInfoWx.nickName : app.lang.home_default_nickname;
};

Page(pageParams);
