const Event = require('./utils/event.js');

let appParams = {
    config: require('./config.js'),
    event: new Event(),
    lang: require('./utils/language.js'),
    util: require('./utils/util.js'),
    cache: {}
};

appParams.onLaunch = function () {
    try {
        for (let key of wx.getStorageInfoSync().keys) {
            this.cache[key] = wx.getStorageSync(key);
        }
    } catch (e) {
        console.error('getStorageInfo 失败。详细信息：' + e.message);
    }

    this.cache.authUserInfo = null;

    if (wx.getSetting) {
        wx.getSetting({
            success: res => {
                if (this.cache.authUserInfo = res.authSetting['scope.userInfo']) {
                    console.log('已有权限 开始静默获取最新用户信息');
                    this.getUserInfoWx();
                }
            }
        });
    }

    setTimeout(() => {
        console.log('缓存 app.cache', this.cache);
    }, 500);
};

appParams.getUserInfoWx = function (completeCallback) {
    let userInfoWx = null;

    wx.getUserInfo({
        success(res) {
            console.info('已授权 获取成功');
            userInfoWx = res.userInfo;
        },
        fail() {
            console.error('未授权 获取失败');
        },
        complete: () => {
            this.cache.userInfoWx = userInfoWx;
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

appParams.saveData = function (obj) {
    for (let key in obj) {
        this.cache[key] = obj[key];
        wx.setStorage({
            key,
            data: obj[key],
        });
    }
};

App(appParams);
