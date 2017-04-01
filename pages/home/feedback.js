let app = getApp(),
    pageParams = {
        data: {
            btn_disabled: true,
            btn_loading: false
        }
    };

pageParams.inputInput = function(e) {
    let btn = true;
    if (e.detail.value != '') {
        btn = false;
    }
    this.setData({
        btn_disabled: btn
    });
};

pageParams.formSubmit = function(e) {
    this.setData({
        btn_loading: true
    });
    wx.request({
        url: app.SERVER_URL + '/feedback',
        data: {
            data: e.detail.value.content
        },
        method: 'POST',
        success: (res) => {
            if (res.data.status == 200) {
                wx.showModal({
                    title: '啦啦啦',
                    content: '已提交，谢谢啦！',
                    showCancel: false,
                    success: function (res) {
                        wx.navigateBack();
                    }
                });
            } else {
                wx.showModal({
                    title: '捂脸',
                    content: res.data.msg || '服务君发呆中。',
                    showCancel: false
                });
            }
        },
        fail: () => {
            wx.showModal({
                title: '摊手',
                content: '你网络有问题，或者服务器君被人抱走了，稍后再试吧。',
                showCancel: false
            });
        },
        complete: () => {
            this.setData({
                btn_loading: false
            });
        }
    });
};

Page(pageParams);