let app = getApp(),
    request = {},
    targetStatusCode = 200,
    url = '';

const config = app.config;

function proxy(data, successCallback, failCallback, completeCallback) {
    app.cache.requestSum = app.cache.requestSum || 0;

    if (app.cache.requestSum === 0) {
        // 基础库 1.1.0 开始支持
        if (wx.showLoading) {
            wx.showLoading({
                title: app.lang.loading
            });
        } else {
            wx.showNavigationBarLoading();
        }
    }

    app.cache.requestSum++;

    wx.request({
        url,
        data,
        method: 'POST',
        success(res) {
            if (res.statusCode === targetStatusCode && (res.data.data || res.data.code || res.data === '')) {
                console.info('服务正常：', res.data || '无返回');
                typeof successCallback == 'function' && successCallback(res.data);
            } else {
                console.warn('服务出错 状态码：', res.statusCode, '详细信息：', res);
                let content = res.data.code ? ('#' + res.data.code + '，' + res.data.msg) : app.lang.service_unavailable;
                app.showErrModal(content, failCallback);
            }

            // 复位
            targetStatusCode = 200;
        },
        fail(res) {
            console.error(res);
            app.showErrModal(app.lang.request_failed);
        },
        complete() {
            app.cache.requestSum--;

            if (app.cache.requestSum === 0) {
                // 基础库 1.1.0 开始支持
                if (wx.hideLoading) {
                    wx.hideLoading();
                } else {
                    wx.hideNavigationBarLoading();
                }
            }

            typeof completeCallback == 'function' && completeCallback();
        }
    });
}

request.eduAuth = function (data, successCallback, failCallback) {
    targetStatusCode = 204;
    url = config.eduAuthURL;
    proxy(data, successCallback);
};

request.getEduSchedule = function (data, successCallback, failCallback) {
    url = config.eduScheduleURL;
    proxy(data, successCallback, failCallback);
};

request.cardAuth = function (data, successCallback, failCallback) {
    targetStatusCode = 204;
    url = config.cardAuthURL;
    proxy(data, successCallback, failCallback);
};

request.getCardBalance = function (data, successCallback) {
    url = config.cardBalanceURL;
    proxy(data, successCallback);
};

request.getCardRecord = function (data, successCallback) {
    url = config.cardRecordURL;
    proxy(data, successCallback);
};

request.handleDorm = function (data, successCallback, completeCallback) {
    url = config.dormURL;
    proxy(data, successCallback, null, completeCallback);
};

request.elecRecharge = function (data, successCallback, failCallback) {
    if (data.check) {
        targetStatusCode = 204;
    }
    url = config.elecRechargeURL;
    proxy(data, successCallback, failCallback);
};

request.getElecConsumeRecord = function (data, successCallback) {
    data.type = 'consume';
    url = config.elecRecordURL;
    proxy(data, successCallback);
};

request.getElecDormRechargeRecord = function (data, successCallback) {
    data.type = 'recharge';
    data.item = 'dorm';
    url = config.elecRecordURL;
    proxy(data, successCallback);
};

request.getElecUserRechargeRecord = function (data, successCallback) {
    data.type = 'recharge';
    data.item = 'user';
    url = config.elecRecordURL;
    proxy(data, successCallback);
};

request.getElecRemain = function (data, successCallback) {
    url = config.elecRemainURL;
    proxy(data, successCallback);
};

module.exports = request;
