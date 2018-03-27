let app = getApp(),
    pageParams = {
        data: {
            text_about: app.lang.setting_about,
            text_authorization: app.lang.setting_authorization,
            text_changelog: app.lang.setting_changelog,
            text_edu: app.lang.edu,
            text_exit: app.lang.setting_exit,
            text_feedback: app.lang.setting_feedback,
            text_scheduleBg: app.lang.setting_schedule_bg,
            text_scheduleBgStyle: app.lang.setting_schedule_bg_style,
            isBindEdu: (app.cache.dataUserInfo && app.cache.dataUserInfo.isBindEdu ? true : false),
            isLogin: (app.cache.stu ? true : false),
            wxSettingCanUse: (wx.openSetting ? true : false)
        }
    };

pageParams.onReady = function () {
    wx.setNavigationBarTitle({
        title: app.lang.home_setting
    });

    this.renderPage();
};

pageParams.renderPage = function() {
    if (app.cache.globalRefresh) {
        this.setData({
            isBindEdu: app.cache.dataUserInfo && app.cache.dataUserInfo.isBindEdu ? true : false,
            isLogin: app.cache.stu ? true : false
        });
    }

    this.setData({
        scheduleBg: app.cache.dataScheduleBg || null,
    });
};

pageParams.bindSetScheduleBg = function (e) {
    wx.chooseImage({
        count: 1,
        success: res => {
            let tempFilePaths = res.tempFilePaths;
            wx.saveFile({
                tempFilePath: tempFilePaths[0],
                success: res => {
                    this.changeScheduleBg({path: res.savedFilePath});
                    this.checkScheduleBgStyle();
                },
            });
        },
    });
};

pageParams.bindSetScheduleBgStyle = function () {
    wx.showActionSheet({
        itemList: this.data.text_scheduleBgStyle,
        success: res => {
            this.changeScheduleBg({style: res.tapIndex});
        },
    });
};

pageParams.bindRemoveScheduleBg = function () {
    wx.showModal({
        title: app.lang.modal_title,
        content: app.lang.setting_schedule_bg_remove,
        confirmText: app.lang.modal_confirm,
        cancelText: app.lang.modal_cancel,
        success: res => {
            if (res.confirm) {
                this.changeScheduleBg(null);
            }
        },
    });
};

pageParams.changeScheduleBg = function (scheduleBg) {
    let data = null;

    if (scheduleBg) {
        app.saveData({dataScheduleBg: scheduleBg});
        data = Object.assign({}, app.cache.dataScheduleBg, scheduleBg);
    } else {
        wx.removeSavedFile({filePath: app.cache.dataScheduleBg.path});
        wx.removeStorage({key: 'dataScheduleBg'});
        delete app.cache.dataScheduleBg;
    }

    app.event.emit('changeScheduleBg', data);
    this.renderPage();
};

pageParams.checkScheduleBgStyle = function () {
    // style 的值可能为 0 故不能省略后面的比对
    if (app.cache.dataScheduleBg.style !== undefined) {
        wx.showToast({title: app.lang.setting_schedule_bg_success});
        return;
    }

    // 设置默认图片样式
    app.saveData({dataScheduleBg: {style: 0}});

    this.renderPage();

    wx.showModal({
        title: app.lang.index_schedule_detail_title,
        content: app.lang.setting_schedule_bg_style_tip,
        confirmText: app.lang.modal_confirm,
        showCancel: false,
    });
};

pageParams.bindContact = function () {
    // 基础库 1.1.0 开始支持
    if (! wx.canIUse || ! wx.canIUse('button.open-type.contact')) {
        app.showErrModal(app.lang.wx_version_warn);
    }

    console.log('进入客服会话');
};

pageParams.bindExit = function () {
    wx.showModal({
        title: app.lang.modal_title,
        content: app.lang.setting_exit_content,
        confirmText: app.lang.modal_confirm,
        cancelText: app.lang.modal_cancel,
        success(res) {
            if (res.confirm) {
                wx.clearStorage();
                app.cache = {
                    globalRefresh: true,
                    userWxInfo: app.cache.userWxInfo
                };
                app.event.emit('exit');
                wx.switchTab({
                    url: '/pages/home/home'
                });
            }
        }
    });
};

pageParams.bindWxSetting = function () {
    wx.openSetting({
        success() {
            console.info('授权状态已变更');
            app.event.emit('changeAuth');
        }
    });
};

Page(pageParams);
