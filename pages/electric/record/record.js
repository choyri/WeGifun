let app = getApp(),
    electricService = require('../../../utils/electricService.js'),
    request = require('../../../utils/request.js'),
    pageParams = {
        data: {
            dormInfo: electricService.getDormInfo(),

            // index:全局下标 inner:内部滑块下标 outer:外部滑块下标 # 第一个外部滑块里套了两个内部滑块
            swiperSelected: {index: 0, inner: 0, outer: 0},

            titleSlider: {
                width: 100 / app.lang.elec_record_title.length,        // 百分比
                left: 0
            },

            text_dormConsumeInfo: app.lang.elec_record_dorm_consume_info,
            text_dormRechargeTitle: app.lang.elec_record_dorm_recharge_title,
            text_dormRechargeNull: app.lang.elec_record_dorm_recharge_null,
            text_title: app.lang.elec_record_title,
            text_userRechargeTip: app.lang.elec_record_user_recharge_tip
        }
    };

pageParams.onLoad = function () {
    app.event.on('customDorm', this.renderPage, this);
};

pageParams.onReady = function () {
    wx.setNavigationBarTitle({
        title: app.lang.elec_record
    });

    this.renderPage();
};

pageParams.onUnload = function () {
    app.event.off(this);
};

pageParams.renderPage = function (newDorm) {
    this.dorm = app.cache.customDorm = newDorm || app.cache.dataDorm || {};

    if (this.dorm.id === undefined) {
        app.showErrModal(app.lang.unknown_error);
        return;
    }

    if (this.dorm.id !== this.data.dormInfo.id) {
        this.setData({
            dormInfo: electricService.getDormInfo(this.dorm)
        });
    }

    this.request(this.data.swiperSelected.index);
};

pageParams.bindScrollToLower = function (e) {
    if (this.data.refreshState_loading || this.data.refreshState_end) {
        console.info('正在刷新？', this.data.refreshState_loading, '刷新结束？', this.data.refreshState_end);
        return;
    }

    console.log('触底刷新');

    this.request(2, true);
};

pageParams.bindTitleTap = function (e) {
    let id = e.currentTarget.dataset.id,
        swiperSelected = this.data.swiperSelected,
        titleSlider = this.data.titleSlider;

    console.info('当前点击：', id);

    if (swiperSelected.index !== id) {
        swiperSelected.index = id;

        if (id < 2) {
            // 内部滑块
            swiperSelected.inner = id;
            swiperSelected.outer = 0;
        } else {
            // 外部滑块
            swiperSelected.outer = 1;
        }

        titleSlider.left = titleSlider.width * id;

        this.setData({
            swiperSelected,
            titleSlider
        });

        this.request(id);
    }
};

pageParams.forbidSwiperMove = function () {
    // 禁止左右滑动
};

pageParams.request = function (index, refresh = false) {
    this.requestData = {
        id: app.cache.stu.id,
        pwd: app.cache.stu.cardPwd,
        room: this.dorm.id
    };

    switch (index) {
        case 0:
            if (this.data.dormConsume && this.data.dormConsume.id === this.dorm.id) {
                console.log('宿舍用电 已有数据');
                return;
            }

            request.getElecConsumeRecord(this.requestData, (res) => {
                let dormConsume = electricService.processDormConsume(res);
                dormConsume.id = this.dorm.id;
                console.info('宿舍用电 数据处理结果：', dormConsume);

                this.setData({
                    dormConsume
                });
            });

            break;
        case 1:
            if (this.data.dormRecharge && this.data.dormRecharge.id === this.dorm.id) {
                console.log('宿舍购电 已有数据');
                return;
            }

            request.getElecDormRechargeRecord(this.requestData, (res) => {
                let dormRecharge = electricService.processDormRecharge(res.data);
                dormRecharge.id = this.dorm.id;
                console.info('宿舍购电 数据处理结果：', dormRecharge);

                this.setData({
                    dormRecharge
                });
            });

            break;
        case 2:
            if (this.data.userRecharge && ! refresh) {
                console.log('用户购电 已有数据');
                return;
            }

            if (refresh) {
                this.setData({
                    refreshState_loading: true
                });
            }

            if (this.nextPageUserRecharge) {
                this.requestData.page = this.nextPageUserRecharge;
            }

            request.getElecUserRechargeRecord(this.requestData, (res) => {
                // 存放原始数据
                this.rawUserRecharge = this.rawUserRecharge || [];

                // 加入数据
                this.rawUserRecharge.push.apply(this.rawUserRecharge, res.data);

                // 存放页数
                this.nextPageUserRecharge = res.next;

                // 如果下一页为零表示已到底
                let refreshState_end = false;
                if (this.nextPageUserRecharge === 0) {
                    refreshState_end = true;
                }

                let userRecharge = electricService.processUserRecharge(this.rawUserRecharge);
                console.info('用户购电 数据处理结果：', userRecharge);

                this.setData({
                    refreshState_end,
                    refreshState_loading: false,
                    userRecharge
                });
            });

            break;
        default:
            // null
    }
};

Page(pageParams);
