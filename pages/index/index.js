let app = getApp(),
    pageParams = {
        data: {
            weekTitle: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],

            // 每节课通过 style 的 top 进行定位 # 第一个是占位符 →_→ 后面的数字 计算过程见文档
            courseTop: ['LaLaLa', 0, 210, 425, 635, 850],

            // 调色板 # 课程背景颜色
            palette: ['#3399CC', '#669999', '#CC9966', '#FF6666', '#666699', '#33CC99', '#996666', '#FF99CC', '#99CC33', '#99CCFF'],

            // 当前周数
            weeks: 0,

            // 课程信息
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
            title: '嘿嘿',
            content: '数据为空，现在就去获取课表？',
            confirmText: '来吧',
            cancelText: '不要',
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
    // 当前周数 # 根据开学日期和当前日期计算
    // # 参考资料 JS原生Date类型方法的一些冷知识 http://t.cn/RyAh1MZ
    let weeks = Math.ceil(((new Date()).getTime() - (new Date(app.cache.termBegin)).getTime()) / 1000 / 3600 / 24 / 7),
        resCourses = app.cache.courses,
        resWeekTitle = [],
        index = 0,
        courseBg =  {};

    for (let key in resCourses) {
        // 根据课程信息筛选 # 隐藏没有课的 周X
        resWeekTitle.push(this.data.weekTitle[key - 1]);

        for (let subKey in resCourses[key]) {
            for (let subSubKey in resCourses[key][subKey]) {
                let course = resCourses[key][subKey][subSubKey];

                // 每门课一种颜色 # 以课程名字当索引
                let bgKey = course['name'];
                if (! courseBg[bgKey]) {
                    courseBg[bgKey] = this.data.palette[index++ % 10];
                }
                course['bg'] = courseBg[bgKey];

                // 是否显示该门课 # 根据当前周数和单双周分析
                course['display'] = false;
                let weekTime = course['week'].split('-');
                if (weeks >= weekTime[0] && weeks <= weekTime[1]) {
                    switch (weekTime[2]) {
                        case '0':
                            course['display'] = true;
                            break;
                        case '1':
                            if (weeks % 2 == 1) {
                                course['display'] = true;
                            }
                            break;
                        case '2':
                            if (weeks % 2 == 0) {
                                course['display'] = true;
                            }
                            break;
                        default:
                            break;
                    }
                }

                // 特殊课程 # 只上一周
                if (weekTime[0] == weekTime[1]) {
                    if (weeks == weekTime[0]) {
                        // 需要上课

                        // 如果和其他课程冲突 删除排在前面的课程
                        if (subSubKey != 0) {
                            resCourses[key][subKey].splice(0, subSubKey);
                        }
                    } else {
                        // 不用上课就删除

                        if (subSubKey == 0) {
                            // 同一时间只有一节 直接删除
                            delete resCourses[key][subKey];
                        } else {
                            // 否则 删除自己
                            resCourses[key][subKey].splice(subSubKey, 1);
                        }
                    }
                }

                // 该课程是否多小节连上 # 如 1-4 / 5-8 / 9-11 小节连上
                course['height'] = 0;
                if (resCourses[key][subKey - 1]) {
                    // 如果上一节有课 进行对比
                    let tmp = resCourses[key][subKey - 1];
                    for (let tmpKey in tmp) {
                        let tmp1 = course['name'] + course['week'] + course['room'],
                            tmp2 = tmp[tmpKey]['name'] + tmp[tmpKey]['week'] + tmp[tmpKey]['room'];
                        if (tmp1 == tmp2) {
                            // 如果上一节课和当前课一样 即连上 修改上节的 height
                            // # subkey 为 6 时表示第 11 小节 故设为 300 否则设为 410
                            tmp[tmpKey]['height'] = subKey == 6 ? 300 : 410;

                            // 删除当前这节课 # 不删也行 上一节课变长就挡住了这节
                            delete resCourses[key][subKey];
                        }
                    }
                }
            }
        }

        // 删除特殊课程后 有可能出现空对象 此处将他们删除
        if (Object.getOwnPropertyNames(resCourses[key]).length == 0) {
            delete resCourses[key];
            resWeekTitle.splice(key - 1, 1);
        }
    }

    // 保存渲染后的课程信息
    this.setData({
        weekTitle: resWeekTitle,
        weeks: weeks,
        courses: resCourses
    })

    console.log(this.data.courses)
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
        course = this.data.courses[dataSet.day][dataSet.lesson][dataSet.id],
        weekTime = course['week'].split('-'),
        weekArr = ['', ', 单', ', 双'],
        week = '';

    week = weekTime[0] + '-' + weekTime[1] + ' 周' + weekArr[weekTime[2]];

    wx.showModal({
        title: '详情',
        content: course['name'] + ' / ' + course['teacher'] + ' / ' + course['room'] + ' / ' + week,
        confirmText: '多谢',
        showCancel: false
    });
};

Page(pageParams);