let app = getApp(),
    electricService = require('../../../utils/electricService.js'),
    request = require('../../../utils/request.js'),

    // 图标状态 # 成功与失败
    iconState = {success: {type: 'success', color: '#1aad19'}, failure: {type: 'clear', color: '#ff3e3e'}},

    pageParams = {
        data: {
            // 充值金额 # 0 代表自定义
            amountItems: [{value: 5}, {value: 10}, {value: 15}, {value: 20}, {value: 50}, {value: 0}],

            btn_disabled: true,
            checkDorm: 'N/A',
            dorm: electricService.getDormInfo(),
            icon: {class: '', state: iconState.success},

            text_btnTitle: app.lang.btn_title,
            text_check: app.lang.elec_recharge_check,
            text_checkTip: app.lang.elec_recharge_check_tip,
            text_custom: app.lang.elec_recharge_custom,
            text_pwdTip: app.lang.elec_recharge_pwd_tip
        }
    };

pageParams.onLoad = function () {
    app.event.on('customDorm', this.renderPage, this);
};

pageParams.onReady = function () {
    wx.setNavigationBarTitle({
        title: app.lang.elec_recharge
    });

    this.renderPage();
};

pageParams.onUnload = function () {
    app.event.off(this);
};

pageParams.renderPage = function (newDorm) {
    this.dorm = app.cache.customDorm = newDorm || app.cache.dataDorm;

    if (this.dorm.id !== this.data.dorm.id) {
        this.setData({
            dorm: electricService.getDormInfo(this.dorm)
        });
    }

    this.requestData = {
        id: app.cache.stu.id,
        pwd: app.cache.stu.cardPwd,
        room: this.dorm.id
    };

    let checkDorm = '';

    request.elecRecharge(this.requestData, (res) => {
        console.info('服务端宿舍信息：', res.data);

        this.setData({
            checkDorm: res.data
        });
    }, () => {
        // 因为失败会弹出 Modal 点击按钮后才执行回调 所以不能把 checkDorm 统一放到完成回调里设置
        this.setData({
            checkDorm: 'N/A'
        });
    });
};

pageParams.bindAmountChange = function (e) {
    let amountItems = this.data.amountItems,
        newValue = parseInt(e.detail.value);

    for (let amount of amountItems) {
        amount.checked = amount.value === newValue;
    }

    this.setAmount(newValue === 0 ? (this.customAmount || 0) : newValue);

    this.setData({
        amountItems,
        btn_disabled: this.btnIsDisabled()
    });
};

pageParams.bindAmountInput = function (e) {
    // 自定义金额 # 这里设一个 this.customAmount 是为了从固定金额切换为自定义金额时能取到之前输入的自定义值
    this.customAmount = e.detail.value;

    this.setAmount(this.customAmount);

    let btn_disabled = this.btnIsDisabled();
    if (btn_disabled !== this.data.btn_disabled) {
        this.setData({
            btn_disabled
        });
    }
};

pageParams.bindPwdInput = function (e) {
    let data = {},
        icon = this.data.icon,
        oldIconClass = icon.class,
        pwd = e.detail.value;

    // 密码是否正确 # 供判断按钮是否禁用使用
    this.auth = false;

    if (pwd.length === 6) {
        icon.class = 'show';
        if (pwd === app.cache.stu.cardPwd) {
            icon.state = iconState.success;
            this.auth = true;
        } else {
            icon.state = iconState.failure;
        }
    } else {
        icon.class = '';
    }

    if (icon.class !== oldIconClass) {
        data.icon = icon;
    }

    let btn_disabled = this.btnIsDisabled();
    if (btn_disabled !== this.data.btn_disabled) {
        data.btn_disabled = btn_disabled;
    }

    if (Object.keys(data).length > 0) {
        console.info('新值：', data);
        this.setData(data);
    }
};

pageParams.bindSubmit = function () {
    wx.showModal({
        title: app.lang.modal_title,
        content: app.lang.elec_recharge_confirm.replace('{0}', this.data.checkDorm).replace('{1}', this.amount),
        confirmText: app.lang.modal_confirm,
        cancelText: app.lang.modal_cancel,
        success: (res) => {
            if (res.cancel) {
                return;
            }

            this.requestData.check = 'yes';
            this.requestData.money = this.amount;

            let rechargeFail = true;

            request.elecRecharge(this.requestData, () => {
                rechargeFail = false;
            }, null, () => {
                if (rechargeFail) {
                    return;
                }

                wx.showToast({
                    title: app.lang.elec_recharge_success,
                    duration: 1900,
                    complete () {
                        setTimeout(wx.navigateBack, 2000);
                    }
                });
            });
        }
    });
};

pageParams.btnIsDisabled = function () {
    // 校园卡密码正确 && 金额不为零
    if (this.auth && (this.amount && this.amount > 0)) {
        return false;
    } else {
        return true;
    }
};

pageParams.setAmount = function (value) {
    this.amount = (value === '' ? 0 : parseInt(value));
    console.info('当前金额：', this.amount);
};

Page(pageParams);
