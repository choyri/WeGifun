let app = getApp(),
    request = require('../../../utils/request.js'),
    pageParams = {};

pageParams.onLoad = function () {
    wx.setNavigationBarTitle({
        title: app.lang.card_record_btn
    });

    let dateArr = app.util.getRecentDate();

    this.setData({
        text_startDate: app.lang.record_start_date,
        text_endDate: app.lang.record_end_date,
        text_confirm: app.lang.record_confirm,
        text_amount: app.lang.record_amount,
        text_area: app.lang.record_area,
        text_platform: app.lang.record_platform,
        text_time: app.lang.record_time,

        dateArr,
        startDate: dateArr[0],
        endDate: dateArr[1],

        startPickerEnd: dateArr[1],
        endPickerStart: dateArr[0],
    });
};

pageParams.bindDateChange = function (e) {
    if (e.target.id == 'startPicker') {
        this.setData({
            startDate: e.detail.value,
            endPickerStart: e.detail.value
        });
    } else {
        this.setData({
            endDate: e.detail.value,
            startPickerEnd: e.detail.value
        });
    }
};

pageParams.bindSubmit = function () {
    let that = this;

    request.getCardRecord({
        id: app.cache.userInfoStu.id,
        pwd: app.cache.userInfoStu.cardPwd,
        startdate: this.data.startDate,
        enddate: this.data.endDate
    }, function (res) {
        if (res.status == 200) {
            let data = res.data,
                amount = 0;

            for (let item of data) {
                amount += item[0];

                // 处理时间戳 # JavaScript 的时间戳单位是毫秒 需要乘以一千
                item[3] = app.util.formatTime(item[3] * 1000);
            }

            that.setData({
                tip: app.lang.record_tip.replace('{0}', data.length).replace('{1}', amount.toFixed(2)),
                records: data
            });
        } else {
            app.showErrModal(res.msg);
        }
    });
};

Page(pageParams);
