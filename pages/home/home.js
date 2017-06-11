let app = getApp(),
    pageParams = {};

pageParams.onLoad = function () {
    app.event.on('changeAuth', this.renderPage, this);
    app.event.on('exit', this.renderPage, this);
    app.event.on('loginSuccess', this.renderPage, this);

    wx.setNavigationBarTitle({
        title: app.lang.title,
    });

    this.renderPage();
};

pageParams.onUnload = function () {
    app.event.off(this);
};

pageParams.renderPage = function () {
    let wxInfo = app.cache.userInfoWx,
        stuInfo = app.cache.userInfoStu,
        userInfo = {
            stuid: app.lang.home_stuid_null,
            isBindCard: false
        };

    userInfo.avatar = wxInfo ? wxInfo.avatarUrl : '/images/avatar.png';
    userInfo.nickname = wxInfo ? wxInfo.nickName : app.lang.home_default_nickname;

    if (stuInfo) {
        userInfo.stuid = app.lang.home_stuid.replace('{0}', stuInfo.id);

        if (stuInfo.cardPwd) {
            userInfo.isBindCard = true;
        }
    }

    this.setData({
        userInfo,
        text_card: app.lang.home_card,
        text_setting: app.lang.home_setting
    });
};

Page(pageParams);
