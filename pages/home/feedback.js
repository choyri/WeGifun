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
        url: app.SERVER_URL + '/api/mina/feedback',
        data: {
            content: e.detail.value.content
        },
        method: 'POST',
        success: (res) => {
            if (res.statusCode == 200) {
                wx.showModal({
                    title: '嘟嘟嘟',
                    content: '已提交，谢谢啦！',
                    showCancel: false,
                    success: function (res) {
                        wx.navigateBack();
                    }
                });
            } else {
                wx.showModal({
                    title: '啊喔',
                    content: '要么是你网络问题, 要么是服务器挂了~',
                    showCancel: false
                });
            }
        },
        fail: () => {
            wx.showModal({
                title: '啊喔',
                content: '要么是你网络问题, 要么是服务器挂了~',
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