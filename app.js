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

    this.getWxInfo();
};

appParams.getWxInfo = function (completeCallback) {
    let that = this,
        userInfoWx = null;

    wx.login({
        success(res) {
            wx.getUserInfo({
                success(res) {
                    userInfoWx = res.userInfo;
                },
                complete() {
                    that.cache.userInfoWx = userInfoWx;

                    typeof completeCallback == 'function' && completeCallback();
                }
            });
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
