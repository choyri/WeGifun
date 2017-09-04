let app = getApp(),
    request = require('../../../utils/request.js'),
    pageParams = {
        data: {
            text_amount: app.lang.record_amount,
            text_area: app.lang.record_area,
            text_confirm: app.lang.btn_title,
            text_startDate: app.lang.record_start_date,
            text_endDate: app.lang.record_end_date,
            text_platform: app.lang.record_platform,
            text_time: app.lang.record_time
        }
    };

pageParams.onReady = function () {
    wx.setNavigationBarTitle({
        title: app.lang.card_record
    });

    let dateArr = app.util.getRecentDate();

    this.setData({
        dateArr,
        startDate: dateArr[0],
        endDate: dateArr[1],
        startPickerEnd: dateArr[1],
        endPickerStart: dateArr[0]
    });
};

pageParams.bindDateChange = function (e) {
    // 结束日期选择器的开始日期 不能超过 开始日期选择器的结束日期

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
    request.getCardRecord({
        id: app.cache.stu.id,
        pwd: app.cache.stu.cardPwd,
        startDate: this.data.startDate,
        endDate: this.data.endDate
    }, (res) => {
        let amount = 0;

        for (let item of res.data) {
            amount += item[0];

            // 处理时间戳 # JavaScript 的时间戳单位是毫秒 需要乘以一千
            item[3] = app.util.formatTime(item[3] * 1000);
        }

        this.setData({
            records: res.data,
            tip: app.lang.record_tip.replace('{0}', res.data.length).replace('{1}', amount.toFixed(2))
        });
    });
};

Page(pageParams);
