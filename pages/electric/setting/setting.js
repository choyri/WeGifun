let app = getApp(),
    electricService = require('../../../utils/electricService.js'),
    request = require('../../../utils/request.js'),

    // 楼栋编号组 根据各园区的楼栋数量返回 # 下标从 1 开始
    buildingNumGroup = [10, 7, 6, 14, 2].map((x) => {return app.util.getNumArr(x, 1)}),

    pageParams = {
        data: {
            btn_disabled: true,

            text_btnTitle: app.lang.btn_title,
            text_building: app.lang.elec_setting_building,
            text_history: app.lang.elec_setting_history,
            text_room: app.lang.elec_setting_room
        }
    };

pageParams.onLoad = function (e) {
    this.action = e.action || 'save';
    this.id = e.id || '';
};

pageParams.onReady = function () {
    wx.setNavigationBarTitle({
        title: app.lang.elec_setting
    });

    // 基础库 1.1.0 开始支持
    if (! wx.canIUse || ! wx.canIUse('picker.mode.multiSelector')) {
        app.showErrModal(app.lang.wx_version_warn, () => {
            wx.navigateBack();
        });
        return;
    }

    this.requestData = {
        id: app.cache.stu.id,
        pwd: app.cache.stu.cardPwd
    };

    this.renderPage();
};

pageParams.renderPage = function (newDorm) {
    let data = {},
        dorm = newDorm || app.cache.dataDorm || {};

    console.info('开始渲染 dorm：', dorm);

    // 如果不是设置个人宿舍 还得看看有没有自定义值
    if (this.action !== 'save') {
        dorm = app.cache.customDorm || dorm;
    }

    if (dorm.id === undefined) {
        this.initDorm((dorm) => {
            this.renderPage(dorm);
        });
        return;
    }

    // 如果是加载页面 就加上宿舍历史记录
    if (! newDorm) {
        data.dormHistory = (app.cache.dataDormHistory || []).map((id) => {return electricService.processDorm(id)});
    }

    // 先处理选择器 后面才能判断按钮是否禁用 顺序不能对调
    data.picker = this.processPicker(dorm);

    data.btn_disabled = this.btnIsDisabled();

    this.setData(data);
};

pageParams.bindHistoryTap = function (e) {
    console.info('当前点击：', e.currentTarget.dataset.id);

    let picker = this.processPicker(electricService.processDorm(e.currentTarget.dataset.id));

    if ((picker.building + picker.room) !== (this.data.picker.building + this.data.picker.room)) {
        this.setData({
            picker
        });
    }
};

pageParams.bindInput = function (e) {
    console.info('输入框新值：', e.detail.value);

    // 房间号 # 201
    this.room = e.detail.value;

    let btn_disabled = this.btnIsDisabled();
    if (btn_disabled !== this.data.btn_disabled) {
        this.setData({
            btn_disabled
        });
    }
};

pageParams.bindPickerChange = function (e) {
    console.info('选择器新值：', e.detail.value);

    // 楼栋号 # 101 # 下标从零开始 所以要加一
    this.building = (e.detail.value[0] + 1) + '' + app.util.padNum(e.detail.value[1] + 1);

    let picker = this.data.picker;
    picker.building = picker.range[0][e.detail.value[0]] + ' ' + (e.detail.value[1] + 1);
    picker.room = this.room;

    this.setData({
        picker
    });
};

pageParams.bindPickerColumnChange = function (e) {
    console.info('修改的列为', e.detail.column, ' 值为', e.detail.value);

    let picker = this.data.picker;
    picker.index[e.detail.column] = e.detail.value;

    // 园区列
    if (e.detail.column === 0) {
        let buildingNumArr = buildingNumGroup[e.detail.value];

        picker.range[1] = buildingNumArr;

        // 如果楼号列旧值大于新值 则移动下标到小的那个值
        if (picker.index[1] > buildingNumArr.length - 1) {
            picker.index[1] = buildingNumArr.length - 1;
        }

        this.setData({
            picker
        });
    }
};

pageParams.bindSubmit = function () {
    let data = {},
        dataDorm = null,
        id = this.building + this.room,
        settingFlag = false,
        requestFail = true;

    if (this.id === id) {
        console.log('房间无变化');
        wx.navigateBack();
        return;
    }

    this.requestData.room = id;

    request.handleDorm(this.requestData, (res) => {
        if (res.data === 'invalid') {
            app.showErrModal(app.lang.elec_setting_room_invalid);
            return;
        }

        requestFail = false;
        dataDorm = electricService.processDorm(id);

        let dormHistoryArg = [id];

        if (this.action === 'save') {
            data.dataDorm = dataDorm;

            // 设置个人宿舍时 把新的默认房间号传入
            dormHistoryArg.push(id);

            settingFlag = true;
        }

        let dataDormHistory = electricService.processDormHistory(...dormHistoryArg);
        data.dataDormHistory = dataDormHistory;

        console.info('新的宿舍数据：', dataDorm, '历史记录：', dataDormHistory);

        app.saveData(data);
        wx.navigateBack();
    }, () => {
        // navigateBack 会导致 Loading 消失  所以在完成回调里再触发事件

        if (requestFail) {
            return;
        }

        if (settingFlag) {
            app.event.emit('settingDorm', dataDorm);
        } else {
            app.event.emit('customDorm', dataDorm);
        }
    });
};

pageParams.btnIsDisabled = function () {
    if (this.building && (this.room && this.room.length === 3)) {
        return false;
    } else {
        return true;
    }
};

pageParams.initDorm = function (callback) {
    console.log('初始化 开始获取房间编号');

    request.handleDorm(this.requestData, (res) => {
        console.info('房间编号：', res.data || '无记录');
        callback(electricService.processDorm(res.data));
    });
};

pageParams.processPicker = function (dorm) {
    let picker = {
            range: [app.lang.elec_setting_garden, buildingNumGroup[dorm.garden - 1 || 0]],
            index: [
                dorm.garden - 1 || 0,
                dorm.building - 1 || 0
            ]
        };

    picker.building = picker.range[0][picker.index[0]] + ' ' + (picker.index[1] + 1);
    picker.room = dorm.room || '';

    this.building = dorm.id.substr(0, 3);
    this.room = picker.room.toString();
    console.log('选择器处理结束 building：', this.building, 'room：', this.room);

    return picker;
};

Page(pageParams);
