let app = getApp(),
    pageParams = {
        data: {
            stuid : '',
            updateTime: ''
        }
    };

pageParams.onLoad = function() {
    // 绑定事件
    app.event.on('getCoursesSuccess', this.renderPage, this);
    app.event.on('logout', this.recover, this);

    this.renderPage();
};

pageParams.onUnload = function() {
    app.event.remove('getCoursesSuccess', this);
    app.event.remove('logout', this);
};

pageParams.renderPage = function() {
    if (app.cache.stuInfo) {
        this.setData({
            stuid: app.cache.stuInfo[0],
            updateTime: this.formatTime(app.cache.updateTime)
        });
    }
    wx.hideNavigationBarLoading();
};

pageParams.recover = function() {
    this.setData({
        stuid: '',
        updateTime: ''
    })
};

pageParams.login = function() {
    if (! this.data.stuid) {
        wx.navigateTo({
            url: '/pages/login/login'
        });
    } else {
        wx.showModal({
            title: '嘿嘿',
            content: '退出当前帐号？',
            confirmText: '来吧',
            cancelText: '不要',
            success: function (res) {
                if (res.confirm) {
                    app.event.emit('logout');
                    wx.clearStorage();
                    wx.switchTab({
                        url: '/pages/index/index'
                    });
                }
            }
        });
    }
};

pageParams.update = function() {
    wx.showModal({
        title: '嘿嘿',
        content: '现在获取最新课表？',
        confirmText: '来吧',
        cancelText: '不要',
        success: function (res) {
            if (res.confirm) {
                wx.showNavigationBarLoading();
                app.getCourses(app.cache.stuInfo[0], app.cache.stuInfo[1]);
            }
        }
    });
};

pageParams.formatTime = function(arg) {
    let date = new Date(arg);

    let M = date.getMonth() + 1;
    M = (M < 10 ? '0' : '') + M + '-';

    let D = date.getDate();
    D = (D < 10 ? '0' : '') + D + ' ';

    let h = date.getHours();
    h = (h < 10 ? '0' : '') + h + ':';

    let m = date.getMinutes();
    m = (m < 10 ? '0' : '') + m + ':';

    let s = date.getSeconds();
    s = (s < 10 ? '0' : '') + s;

    return M + D + h + m + s;
};

Page(pageParams);