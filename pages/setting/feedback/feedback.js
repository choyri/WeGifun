let app = getApp(),
    request = require('../../../utils/request.js'),
    pageParams = {
        data: {
            btn_disabled: true
        }
    };

pageParams.onLoad = function () {
    wx.setNavigationBarTitle({
        title: app.lang.setting_feedback
    });

    this.setData({
        text_content: app.lang.feedback_content,
        text_contact_way: app.lang.feedback_contact_way,
        btn_title: app.lang.btn_title,
        tip: app.lang.feedback_tip
    });
};

pageParams.bindInput = function (e) {
    let btn_disabled = true;

    if (e.detail.value != '') {
        btn_disabled = false;
    }

    // 只有在目的状态与当前状态不同时才会修改数据 提高性能
    if (btn_disabled != this.data.btn_disabled) {
        this.setData({
            btn_disabled
        });
    }
};

pageParams.bindSubmit = function (e) {
    let value = e.detail.value,
        data = value.content + ' // ';

    data += (value.from ? '来自：' + value.from : '联系方式未填写。');

    request.feedback({
        data
    }, function (res) {
        if (res.data.status == 200) {
            wx.showModal({
                title: app.lang.modal_title,
                content: app.lang.feedback_success,
                confirmText: app.lang.modal_confirm,
                showCancel: false,
                complete(res) {
                    wx.navigateBack();
                }
            });
        } else {
            app.showErrModal(res.data.msg);
        }
    });
};

Page(pageParams);
