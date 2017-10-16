let app = getApp(),
    request = {},
    targetStatusCode = 200,
    url = '';

const config = app.config;

function proxy(data, successCallback, failCallback, completeCallback) {
    // 基础库 1.1.0 开始支持
    if (wx.showLoading) {
        wx.showLoading({
            title: app.lang.loading
        });
    }

    wx.request({
        url,
        data,
        method: 'POST',
        success(res) {
            if (res.statusCode === targetStatusCode) {
                console.info('服务正常：', res.data || '无返回');
                successCallback(res.data);
            } else {
                console.warn('服务出错：', res.data);
                let content = '#' + res.data.code + '，' + res.data.msg;
                app.showErrModal(content, failCallback);
            }

            // 复位
            targetStatusCode = 200;
        },
        fail() {
            app.showErrModal(app.lang.request_failed);
        },
        complete() {
            // 基础库 1.1.0 开始支持
            if (wx.hideLoading) {
                wx.hideLoading();
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
