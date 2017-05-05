let app = getApp(),
    pageParams = {
        data: {
            stuid: '',
            stupwd: '',
            stuid_focus: false,
            stupwd_focus: false,
            btn_disabled: true,
            btn_loading: false
        }
    };

pageParams.onLoad = function() {
    // 绑定事件
    app.event.on('getCoursesSuccess', this.loginSuccess, this);
    app.event.on('getCoursesComplete', this.loginComplete, this);    
};

pageParams.onUnload = function() {
    app.event.remove('getCoursesSuccess', this);
    app.event.remove('getCoursesComplete', this);    
};

pageParams.loginSuccess = function() {
    wx.switchTab({
        url: '/pages/index/index'
    });
};

pageParams.loginComplete = function() {
    this.setData({
        btn_loading: false
    });
};

pageParams.inputInput = function(e) {
    if (e.target.id == 'stuid') {
        this.setData({
            stuid: e.detail.value
        });
    } else if (e.target.id == 'stupwd') {
        this.setData({
            stupwd: e.detail.value
        });
    }
    let btn = true;
    if (this.data.stuid.length == 10 && this.data.stupwd.length >= 6) {
        btn = false;
    }
    this.setData({
        btn_disabled: btn
    });
};

pageParams.inputFocus = function(e) {
    if (e.target.id == 'stuid') {
        this.setData({
            stuid_focus: true
        });
    } else if (e.target.id == 'stupwd') {
        this.setData({
            stupwd_focus: true
        });
    }
};

pageParams.inputBlur = function(e) {
    if (e.target.id == 'stuid') {
        this.setData({
            stuid_focus: false
        });
    } else if (e.target.id == 'stupwd') {
        this.setData({
            stupwd_focus: false
        });
    }
};

pageParams.getData = function() {
    this.setData({
        btn_loading: true
    });

    app.getCourses(this.data.stuid, this.data.stupwd);
};

Page(pageParams);