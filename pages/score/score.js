let app = getApp(),
    eduService = require('../../utils/eduService.js'),
    request = require('../../utils/request.js'),
    pageParams = {
        data: {
            text: {
                btnTitle: app.lang.btn_title,
                schoolTime: app.lang.score_schooltime,
                scoreNull: app.lang.score_null,
            },
        },
        tmp: {},
    };

const ARG_GROUP = {
        grade: app.lang.score_grade,
        semester: app.lang.score_semester,
    },
    EMOJI = ['😀', '😏', '😪', '😐'],
    REQUEST_GRADE = 'grade',
    REQUEST_SEMESTER = 'semester';

pageParams.onReady = function () {
    wx.setNavigationBarTitle({
        title: app.lang.score
    });

    this.renderPage();
};

pageParams.renderPage = function () {
    let schoolTime = eduService.getSchoolTime();
    this.oopSchoolTime(schoolTime);

    this.processRequestArg(REQUEST_GRADE, schoolTime.grade);
    this.processRequestArg(REQUEST_SEMESTER, schoolTime.semester);

    this.setData({
        schoolTime,
    });
};

pageParams.bindActionSheet = function (e) {
    let target = e.target.id,
        itemList = ARG_GROUP[target];

    // 删除未达到的年级
    if (target === REQUEST_GRADE) {
        itemList = itemList.slice(0, this.oopSchoolTime().grade);
    }

    wx.showActionSheet({
        itemList,
        success: res => {
            this.processRequestArg(target, res.tapIndex + 1);

            this.setData({
                schoolTime: eduService.getSchoolTime(this.processRequestArg()),
            });
        },
    });
};

pageParams.bindClose = function () {
    this.setData({reportState: false});
};

pageParams.bindSubmit = function () {
    let schoolTime = this.data.schoolTime,
        grade = this.processRequestArg(REQUEST_GRADE),
        semester = this.processRequestArg(REQUEST_SEMESTER),
        year = this.oopSchoolTime().yearGroup[grade - 1];

    request.getEduScore({
        id: app.cache.stu.id,
        pwd: app.cache.stu.eduPwd,
        year,
        semester,
    }, res => {
        let score = eduService.processScore(res.data);

        this.setData({
            report: {
                title: `${EMOJI[grade - 1]} ${schoolTime.gradeName} ${schoolTime.semesterName}`,
                detail: score,
            },
            reportState: true,
        });
    });
};

pageParams.processRequestArg = function (target, value) {
    if (value === undefined) {
        if (target === undefined) {
            return {
                [REQUEST_GRADE]: this.tmp[REQUEST_GRADE],
                [REQUEST_SEMESTER]: this.tmp[REQUEST_SEMESTER],
            };
        }
        return this.tmp[target];
    }
    this.tmp[target] = value;
};

pageParams.oopSchoolTime = function(value) {
    if (value === undefined) {
        return this.tmp.schoolTime || {};
    }
    this.tmp.schoolTime = value;
};

Page(pageParams);
