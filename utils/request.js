let app = getApp(),
    url = '',
    request = {};;

const config = app.config,
    lang = app.lang;

function proxy(data, successCallback, failCallback, completeCallback) {
    if (wx.showLoading) {
        wx.showLoading({
            title: lang.loading
        });
    }

    wx.request({
        url,
        data,
        method: 'POST',
        success(res) {
            if (res.statusCode == 200) {
                successCallback(res.data);
            } else {
                app.showErrModal(lang.server_error);
            }
        },
        fail(res) {
            app.showErrModal(lang.request_failed);

            typeof failCallback == 'function' && failCallback();
        },
        complete() {
            if (wx.hideLoading) {
                wx.hideLoading();
            }

            typeof completeCallback == 'function' && completeCallback();
        }
    });
}

request.jwVerify = function (data, successCallback) {
    url = config.jwVerifyURL;
    proxy(data, successCallback);
};

request.getJwSchedule = function (data, successCallback) {
    url = config.jwScheduleURL;
    proxy(data, successCallback);
};

request.cardVerify = function (data, successCallback) {
    url = config.cardVerifyURL;
    proxy(data, successCallback);
};

request.getCardBalance = function (data, successCallback, completeCallback) {
    url = config.cardBalanceURL;
    proxy(data, successCallback, null, completeCallback);
};

request.getCardRecord = function (data, successCallback) {
    url = config.cardRecordURL;
    proxy(data, successCallback);
};

request.feedback = function (data, successCallback) {
    url = config.feedbackURL;
    proxy(data, successCallback);
};

module.exports = request;
