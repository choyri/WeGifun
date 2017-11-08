let app = getApp(),
    pageParams = {
        data: {
            stu_id: (app.cache.stu ? app.lang.home_stuid.replace('{0}', app.cache.stu.id) : app.lang.home_stuid_null),
            text_card: app.lang.card,
            text_electric: app.lang.electric,
            text_setting: app.lang.home_setting,
            userInfo: app.cache.dataUserInfo || null
        }
    };

pageParams.onLoad = function () {
    app.event.on('changeAuth', this.getUserWxInfo, this);
    app.event.on('exit', this.renderPage, this);
    app.event.on('loginSuccess', this.renderPage, this);
};

pageParams.onReady = function () {
    if (! app.lang.isCN) {
        wx.setNavigationBarTitle({
            title: app.lang.title
        });
    }

    this.renderPage();

    if (! app.cache.userWxInfo && app.cache.hasAuth === undefined) {
        console.log('首次授权');
        this.getUserWxInfo();
    }

    if (app.cache.intro === undefined) {
        wx.showModal({
            title: app.lang.modal_title,
            content: app.lang.intro,
            confirmText: app.lang.modal_confirm,
            showCancel: false,
            success() {
                app.saveData({
                    intro: true
                });
            }
        });
    }
};

pageParams.onUnload = function () {
    app.event.off(this);
};

pageParams.renderPage = function (refresh) {
    refresh = refresh || app.cache.globalRefresh || false;

    if (this.data.userInfo && ! refresh) {
        console.log('直接渲染用户信息缓存');
        return;
    }

    console.log(refresh ? '强制刷新用户信息' : '开始生成用户信息');

    let stu = app.cache.stu,
        stu_id = (stu ? app.lang.home_stuid.replace('{0}', stu.id) : app.lang.home_stuid_null),
        userInfo = {
            isBindCard: ((stu && stu.cardPwd) ? true : false),
            isBindEdu: ((stu && stu.eduPwd) ? true : false)
        };

    this.decorateUser(userInfo, app.cache.userWxInfo);

    console.info('用户信息生成结束：', userInfo);

    this.setData({
        stu_id,
        userInfo
    });

    app.saveData({
        dataUserInfo: userInfo
    });
};

pageParams.getUserWxInfo = function () {
    console.log('开始获取 userWxInfo');

    app.storeUserWxInfo(() => {
        this.renderPage(true);
    });
};

pageParams.decorateUser = function (origin, userWxInfo = null) {
    origin.avatar = userWxInfo ? userWxInfo.avatarUrl : '/images/avatar.png';
    origin.nickName = userWxInfo ? userWxInfo.nickName : app.lang.home_default_nickname;
};

Page(pageParams);
