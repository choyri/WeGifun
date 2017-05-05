let appParams = {
    SERVER_URL: 'https://mydlpu.xu42.cn',
    VERSION: 'v0.1.0',
    event: require('./utils/event'),
    cache: {},
    week: 0,
    semester: '2016-2017-2'
};

appParams.onLaunch = function() {
    try {
        let data = wx.getStorageInfoSync();
        if (data.keys.length) {
            data.keys.forEach((key) => {
                try {
                    this.cache[key] = wx.getStorageSync(key);
                } catch(e) {
                    console.error('getStorage 失败。详细信息：' + e.message);
                }
            });
        }
    } catch(e) {
        console.error('getStorageInfo 失败。详细信息：' + e.message);
    }
};

appParams.saveData = function(obj) {
    for (let key in obj) {
        this.cache[key] = obj[key];
        wx.setStorage({
            key: key,
            data: obj[key],
        })
    }
}


appParams.getTime = function() {
    wx.request({
        url: this.SERVER_URL + '/api/mina/time',
        method: 'get',
        success: (res) => {
            if (res.statusCode != 200) {
                 wx.showModal({
                    title: '啊喔',
                    content: res.data.errmsg,
                    showCancel: false
                });
            } else { //正确获取数据
                let data = res.data;
                this.saveData({
                    'semester': data.semester,
                    'week': data.week,
                    'timeUpdateTime': (new Date()).getTime()
                });
            }
        },
        fail: () => {
            wx.showModal({
                title: '啊喔',
                content: '要么是你网络问题, 要么是服务器挂了~',
                showCancel: false
            });
        }
    });
}

appParams.getCourses = function(id, pwd) {
    wx.clearStorage();
    this.getTime();
    wx.request({
        url: this.SERVER_URL + '/api/mina/timetable',
        data: {
            stuid: id,
            stupwd: pwd,
            semester: this.cache.semester,
            week: this.cache.week,
        },
        method: 'get',
        success: (res) => {
            if (res.statusCode != 200) {
                 wx.showModal({
                    title: '啊喔',
                    content: res.data.errmsg,
                    showCancel: false
                });
            } else { //正确获取数据
                let data = res.data;
                this.saveData({
                    'courses': data,
                    'stuInfo': [id, pwd],
                    'updateTime': (new Date()).getTime()
                });

                this.event.emit('getCoursesSuccess');
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
            this.event.emit('getCoursesComplete');
        }
    });
}

App(appParams);