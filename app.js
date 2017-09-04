const Event = require('./utils/event.js');

let appParams = {
    cache: {},
    config: require('./config.js'),
    event: new Event(),
    lang: require('./utils/language.js'),
    util: require('./utils/util.js')
};

appParams.onLaunch = function () {
    for (let key of wx.getStorageInfoSync().keys) {
        this.cache[key] = wx.getStorageSync(key);
    }
    console.info('缓存 app.cache：', this.cache);

    if (this.cache.version !== this.config.version) {
        console.log('小程序已更新', this.config.version);

        if (this.cache.version !== undefined && this.config.clearStorage) {
            console.log('该版本要求强制清理本地数据缓存');
            wx.clearStorageSync();
            this.cache = {
                clearStorage: true
            };
        }

        this.saveData({
            version: this.config.version
        });
    }

    this.cache.hasAuth = null;

    // 基础库 1.2.0 开始支持
    if (wx.getSetting) {
        wx.getSetting({
            success: res => {
                // 这里是赋值并判断 只有一个等号
                if (this.cache.hasAuth = res.authSetting['scope.userInfo']) {
                    console.log('已有权限 开始静默获取最新用户信息');
                    this.storeUserWxInfo();
                }
            }
        });
    }
};

appParams.storeUserWxInfo = function (completeCallback) {
    let userWxInfo = null;

    wx.getUserInfo({
        success(res) {
            console.info('获取成功：', res.userInfo);
            userWxInfo = res.userInfo;
        },
        fail() {
            console.error('获取失败 未授权');
        },
        complete: () => {
            this.cache.userWxInfo = userWxInfo;
            typeof completeCallback == 'function' && completeCallback();
        }
    });
};

appParams.showErrModal = function (content, completeCallback) {
    wx.showModal({
        title: this.lang.modal_title,
        content,
        confirmText: this.lang.modal_confirm,
        showCancel: false,
        complete() {
            typeof completeCallback == 'function' && completeCallback();
        }
    });
};

appParams.saveData = function (newData) {
    console.log('开始保存数据并更新缓存');

    let data = {},
        isObjData = null,
        oldData = null;

    for (let key in newData) {
        console.info('key：', key, '旧数据：', oldData);

        isObjData = typeof newData[key] === 'object';

        // 如已存在数据 则只更新新的部分
        oldData = this.cache[key] || (isObjData ? {} : null);

        data = isObjData ? Object.assign(oldData, newData[key]) : newData[key];

        console.info('新数据：', newData[key], '更新后的数据：', data);

        this.cache[key] = data;
        wx.setStorage({
            key,
            data
        });
    }
};

App(appParams);
