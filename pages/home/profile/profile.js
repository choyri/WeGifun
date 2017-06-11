let app = getApp(),
    pageParams = {};

pageParams.onLoad = function () {
    app.event.on('loginSuccess', this.renderPage, this);

    wx.setNavigationBarTitle({
        title: app.lang.profile
    });

    this.renderPage();
};

pageParams.onUnload = function () {
    app.event.off(this);
};

pageParams.renderPage = function () {
    this.stuInfo = app.cache.userInfoStu;

    let jw_bind_status = '',
        card_bind_status = '';

    if (this.stuInfo) {
        jw_bind_status = this.stuInfo.jwPwd ? app.lang.profile_bind : app.lang.profile_unbind;
        card_bind_status = this.stuInfo.cardPwd ? app.lang.profile_bind : app.lang.profile_unbind;
    } else {
        jw_bind_status = card_bind_status = app.lang.profile_unbind;
    }

    this.setData({
        text_jw: app.lang.profile_jw,
        jw_bind_status,
        text_card: app.lang.profile_card,
        card_bind_status,
        tip: app.lang.profile_tip
    });
};

pageParams.bindJump = function (e) {
    let url = [];

    url.push('type=' + e.currentTarget.id);

    if (this.stuInfo) {
        url.push('id=' + this.stuInfo.id);

        let tmp = 'action=';
        if (e.currentTarget.id == 'jw') {
            tmp += this.stuInfo.jwPwd ? 'edit' : 'add';
        } else {
            tmp += this.stuInfo.cardPwd ? 'edit' : 'add';
        }
        url.push(tmp);
    }

    url = '/pages/login/login?' + url.join('&');

    wx.navigateTo({
        url
    });
};

Page(pageParams);
