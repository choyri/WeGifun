let app = getApp(),
    eduService = require('../../utils/eduService.js'),
    request = require('../../utils/request.js'),

    id_value = app.cache.stu ? app.cache.stu.id : '',
    id_disabled = id_value ? true : false,

    pageParams = {
        data: {
            btn_disabled: true,
            btn_title: app.lang.btn_title,
            id_clear: '',
            id_disabled,
            id_focus: '',
            id_value,
            pwd_clear: '',
            pwd_focus: '',
            text_id: app.lang.login_id,
            text_pwd: app.lang.login_pwd,

            // 初始值 # 不设置的话渲染页面时会抖动 # 不过这种方法 渲染时改为其他标题也会造成轻微的视觉影响 目前用CSS动画掩盖
            title: '.'
        },
        id: id_value,
        pwd: ''
    };

pageParams.onReady = function () {
    if (! app.lang.isCN) {
        wx.setNavigationBarTitle({
            title: app.lang.title
        });
    }

    this.renderPage();
};

pageParams.renderPage = function () {
    let params = app.cache.loginParams,
        refresh = app.cache.globalRefresh || false;

    this.is_add = (params && params.action !== 'add') ? false : true,
    this.is_edu = (params && params.type !== 'edu') ? false : true;

    console.info('登录操作？', this.is_add, '教务管理系统？', this.is_edu);

    let data = {
        pwd_type: (this.is_edu ? 'text' : 'number'),
        pwd_maxlength: (this.is_edu ? '16' : '6'),
        tip: (this.is_edu ? app.lang.login_tip_edu : app.lang.login_tip_card),
        tip_edit: (this.is_add ? null : app.lang.login_tip_edit),
        title: (this.is_edu ? app.lang.login_title_edu : app.lang.login_title_card)
    };

    if (refresh) {
        data.id_value = app.cache.stu ? app.cache.stu.id : '';
        data.id_disabled = data.id_value ? true : false;
        this.id = data.id_value;
    }

    this.setData(data);
};

pageParams.clear = function (e) {
    let data = {},
        target = e.currentTarget.dataset.target;

    // 清空数据
    this[target] = '';
    data[target + '_value'] = '';

    // 隐藏清除按钮
    data[target + '_clear'] = '';

    // 确定按钮不可点击
    if (this.data.btn_disabled !== true) {
        data.btn_disabled = true;
    }

    this.setData(data);
};

pageParams.bindInput = function (e) {
    let data = {},
        target = e.currentTarget.id;

    this[target] = e.detail.value;

    // 学号密码长度一定时 解除确定按钮的禁止态
    data.btn_disabled = (this.id.length === 8 && this.pwd.length >= 6) ? false : true;

    // 学号密码开始输入后 显示对应的清除按钮
    data[target + '_clear'] = (this[target].length > 0) ? 'show' : '';

    // 找到值有变动的项目 # 不同时才修改 提高性能
    for (let item in data) {
        if (data[item] === this.data[item]) {
            delete data[item];
        }
    }

    if (Object.getOwnPropertyNames(data).length > 0) {
        console.info('新值：', data);
        this.setData(data);
    }
};

pageParams.bindFocusBlur = function (e) {
    let data = {},
        eventType = {
            focus: ' focus',
            blur: ''
        };

    data[e.currentTarget.id + '_focus'] = eventType[e.type];

    this.setData(data);
};

pageParams.bindSubmit = function () {
    let data = {
            id: this.id,
            pwd: this.pwd
        };

    if (! this.is_edu) {
        console.log('校园卡 开始鉴权');

        request.cardAuth(data, (res) => {
            this.requestSuccess(res);
        }, (res) => {
            this.requestFail(res);
        });
        return;
    }

    if (this.is_add) {
        console.log('教务管理系统 开始获取课表');

        request.getEduSchedule(data, (res) => {
            this.requestSuccess(res, true);
        }, (res) => {
            this.requestFail(res);
        });
        return;
    }

    console.log('教务管理系统 开始鉴权');

    request.eduAuth(data, (res) => {
        this.requestSuccess(res);
    }, (res) => {
        this.requestFail(res);
    });
};

pageParams.requestSuccess = function (res, hasData = false) {
    let data = {
            stu: this.handleAuth()
        };

    if (hasData) {
        data.edu = this.handleSchedule(res);
    }

    app.saveData(data);
    app.cache.globalRefresh = true;

    app.event.emit('loginSuccess');

    if (hasData) {
        app.event.emit('updateSchedule', true);
    }

    if (this.data.id_disabled) {
        wx.navigateBack();
    } else {
        wx.switchTab({
            url: (hasData ? '/pages/index/index' : '/pages/home/home')
        });
    }
};

pageParams.requestFail = function () {
    // 如果学号不可编辑 返回错误就清空密码
    if (this.data.id_disabled) {
        this.setData({
            btn_disabled: true,
            pwd_value: ''
        });
    }
}

pageParams.handleAuth = function () {
    let pwdType = this.is_edu ? 'eduPwd' : 'cardPwd',
        stu = {};

    stu.id = this.id;
    stu[pwdType] = this.pwd;

    return stu;
};

pageParams.handleSchedule = function (res) {
    return eduService.processSchedule(res.data);
}

Page(pageParams);
