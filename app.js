let appParams = {
    SERVER_URL: 'https://www.test.com',
    VERSION: 'v0.1.0',
    event: require('./utils/event'),
    cache: {}
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

appParams.getCourses = function(id, pwd) {
    wx.request({
        url: this.SERVER_URL + '/jw/courses',
        data: {
            stuid: id,
            stupwd: pwd
        },
        method: 'POST',
        success: (res) => {
            if (res.data.status == 200) {
                console.log(res.data.data)
                let data = res.data.data;

                // 将数组内容转换成对象
                for (let key in data.courses) {
                    for (let subKey in data.courses[key]) {
                        for (let subSubKey in data.courses[key][subKey]) {
                            let tmp = data.courses[key][subKey][subSubKey];
                            data.courses[key][subKey][subSubKey] = {
                                'name': tmp[0],
                                'week': tmp[1],
                                'teacher': tmp[2],
                                'room': tmp[3]
                            }
                        }
                    }
                }

                this.saveData({
                    'termBegin': data.termBegin,
                    'courses': data.courses,
                    'stuInfo': [id, pwd],
                    'updateTime': (new Date()).getTime()
                });

                this.event.emit('getCoursesSuccess');
            } else {
                wx.showModal({
                    title: '捂脸',
                    content: res.data.msg,
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
            this.event.emit('getCoursesComplete');
        }
    });
}

App(appParams);