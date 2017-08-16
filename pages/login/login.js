let app = getApp(),
    jwHelper = require('../../utils/jwHelper.js'),
    request = require('../../utils/request.js'),
    pageParams = {
        data: {
            btn_disabled: true
        },
        id: '',
        pwd: ''
    };

pageParams.onLoad = function (query) {
    wx.setNavigationBarTitle({
        title: app.lang.login_title
    });

    // 判断当前服务类型 # 教务管理系统 亦或 校园卡
    this.is_jw = query.type == 'card' ? false : true;

    // 判断当前操作类型 # 添加 亦或 修改
    this.is_add = query.action == 'edit' ? false : true;

    if (query.id) {
        this.id = query.id;
    }

    // 如果带学号参数 那么显示学号并禁用学号输入框
    let id_curr = query.id || '',
        id_disabled = id_curr ? true : false,

        // 如果是修改（密码）操作 显示提示
        tip_edit_pwd = this.is_add ? null : app.lang.login_tip_edit_pwd,

        // 根据不同服务类型显示对应的提示
        tip = this.is_jw ? app.lang.login_tip_jw : app.lang.login_tip_card,

        // 密码类型 # 字符密码 亦或 数字密码
        pwd_type = this.is_jw ? 'text' : 'number',

        // 密码长度
        pwd_maxlength = this.is_jw ? '16' : '6';

    this.setData({
        text_id: app.lang.login_id,
        text_pwd: app.lang.login_pwd,
        btn_title: app.lang.btn_title,
        tip,
        id_curr,
        id_disabled,
        pwd_type,
        pwd_maxlength,
        tip_edit_pwd
    });
};

pageParams.onUnload = function () {
    app.event.off(this);
};

pageParams.bindFocusBlur = function (e) {
    let tmp = {},
        eventType = {
            focus: ' focus',
            blur: ''
        };

    tmp[e.currentTarget.id + '_focus'] = eventType[e.type];

    this.setData(tmp);
};

pageParams.bindInput = function (e) {
    this[e.currentTarget.id] = e.detail.value;

    let btn_disabled = true;

    if (this.id.length == 8 && this.pwd.length >= 6) {
        btn_disabled = false;
    }

    // 只有在目的状态与当前状态不同时才会修改数据 提高性能
    if (btn_disabled != this.data.btn_disabled) {
        this.setData({
            btn_disabled
        });
    }
};

pageParams.bindConfirm = function () {
    let that = this,
        data = {
            id: this.id,
            pwd: this.pwd
        };

    if (this.is_jw) {
        if (this.is_add) {
            request.getJwSchedule(data, function (res) {
                that.requestSuccess('jw', res, 'schedule');
            });
        } else {
            request.jwVerify(data, function (res) {
                that.requestSuccess('jw', res);
            });
        }
    } else {
        request.cardVerify(data, function (res) {
            that.requestSuccess('card', res);
        });
    }
};

pageParams.requestSuccess = function (requestType, res, target) {
    let that = this;

    if (res.status == 200) {
        let userInfoStu = app.cache.userInfoStu || {};
        userInfoStu.id = this.id;
        userInfoStu[requestType + 'Pwd'] = this.pwd;

        let data = {
            userInfoStu
        };

        if (target) {
            data.jw = jwHelper.processSchedule(res.data);
        }

        app.saveData(data);
        app.event.emit('loginSuccess', true);

        if (requestType == 'jw') {
            app.event.emit('jwUpdate', true);
        }

        if (that.data.id_disabled) {
            wx.navigateBack();
        } else {
            let url = target ? '/pages/index/index' : '/pages/home/home';

            wx.switchTab({
                url
            });
        }
    } else {
        app.showErrModal(res.msg, function () {
            // 如果学号不可编辑 返回错误就清空密码
            if (that.data.id_disabled) {
                that.setData({
                    pwd_value: '',
                    btn_disabled: true
                });
            }
        });
    }
};

Page(pageParams);
