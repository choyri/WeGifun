let app = getApp(),
    pageParams = {
        data: {
            weekTitle: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            courseTop: ['', 210, 425, 635, 850, 1060],
            palette: ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#f1c40f', '#e67e22', '#e74c3c', '#bdc3c7', '#95a5a6'],
            weeks: 0,
            courses: {}
        }
    };

pageParams.onLoad = function() {
    // 绑定事件
    app.event.on('getCoursesSuccess', this.renderCourses, this);
    app.event.on('logout', this.recover, this);

    if (app.cache.courses) {
        this.renderCourses();
    } else {
        wx.showModal({
            title: '啊喔',
            content: '数据为空，现在就去获取课表？',
            confirmText: '好哒',
            cancelText: '算了',
            success: function (res) {
                if (res.confirm) {
                    wx.navigateTo({
                        url: '/pages/login/login'
                    });
                }
            }
        });
    }
};

pageParams.onUnload = function() {
    app.event.remove('getCoursesSuccess', this);
    app.event.remove('logout', this);
};

pageParams.renderCourses = function() {
    this.recover();
    let weeks = app.cache.week,
        resCourses = app.cache.courses,
        resWeekTitle = [],
        index = 0,
        colorIndex = Math.floor(Math.random()*(this.data.palette.length)),
        courseBg =  {};

    for (let key in resCourses) {
        resWeekTitle.push(this.data.weekTitle[key]);
        index+=1;
        for (let subKey in resCourses[key]) {
            for (let subSubKey in resCourses[key][subKey]) {
                let course = resCourses[key][subKey][subSubKey];
                course['shortName'] = course['name'];
                if (course['name'].length > 9) {
                    course['shortName'] = course['name'].slice(0,9) + '...';
                }
                let bgKey = course['name'];
                if (! courseBg[bgKey]) {
                    courseBg[bgKey] = this.data.palette[colorIndex++ % (this.data.palette.length)];
                }
                course['bg'] = courseBg[bgKey];
            }
        }
    }
    if (index == 0) {
        wx.showModal({
            title: '哎哟～',
            content: '本周无课哟～ 关掉手机浪去吧~',
            confirmText: 'Get',
            showCancel: false
        });
    }
    // 保存渲染后的课程信息
    this.setData({
        weekTitle: resWeekTitle,
        weeks: weeks,
        courses: resCourses
    })
};

pageParams.recover = function() {
    this.setData({
        weekTitle: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        weeks: 0,
        courses: {}
    })
};

pageParams.showDetail = function(e) {
    let dataSet = e.currentTarget.dataset,
        course = this.data.courses[dataSet.day][dataSet.lesson][dataSet.id];

    wx.showModal({
        title: '详情',
        content: course['name'] + ' / ' + course['room'] + ' / ' + course['week'] + ' / ' + course['teacher'],
        confirmText: '知道了',
        showCancel: false
    });
};

Page(pageParams);