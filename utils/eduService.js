let app = getApp();

// 处理原始课表数据
function processSchedule(data) {
    let schedule = data.schedule,
        res = [],
        resDay = {},
        resSection = {},
        resCourse = {};

    // 每天
    for (let key in schedule) {
        resDay = {
            unique: key,
            index: parseInt(key),
            data: []
        };

        // 每节次
        for (let subKey in schedule[key]) {
            resSection = {
                unique: [key, subKey].join('-'),
                index: parseInt(subKey),
                data: []
            };

            // 每门 # 如 区分单双周 就有两门课
            for (let subSubKey in schedule[key][subKey]) {
                let tmp = schedule[key][subKey][subSubKey],
                    data = {
                        name: tmp[0],
                        week: tmp[1],
                        teacher: tmp[2],
                        room: tmp[3]
                    };

                // 节次偏移 # 只有一小节的特殊课程
                if (tmp[4]) {
                    data.offset = tmp[4];
                }

                resCourse = {
                    unique: [key, subKey, subSubKey].join('-'),
                    index: parseInt(subSubKey),
                    data
                };

                resSection.data.push(resCourse);
            }

            resDay.data.push(resSection);
        }

        res.push(resDay);
    }

    return {
        updateTime: (new Date()).getTime(),
        termBegin: data.termBegin,
        schedule: res
    };
}

// 根据周数渲染课表
function renderSchedule(currWeek, schedule) {
    console.log('开始渲染课表');

    let scheduleBg = {},
        weekTitle = [],

        // 调色板 # 课程块背景颜色 每门课一种 当前内置十二种
        palette = ['#75878a', '#6b6882', '#3d3b4f', '#75664d', '#c89b40', '#b35c44', '#21a675', '#db5a6b', '#8c4356', '#a98175', '#1685a9', '#426666'],

        // 调色板下标
        paletteIndex = 0;

    // 每天
    for (let day of schedule) {
        day.unique = currWeek + '_' + day.unique;

        // 将这一天对应的星期标题加到结果数组中 # 目的是如果某一天没课就可以将那一列隐藏
        weekTitle.push(day.index - 1);

        // 节次下标 # 用于定位上一大节课
        let sectionIndex = 0;

        // 每节次
        for (let section of day.data) {
            section.unique = currWeek + '_' + section.unique;

            // 每门 # 不区分单双周的话只有一门 否则多于一门
            for (let course of section.data) {
                course.unique = currWeek + '_' + course.unique;

                let courseData = course.data,

                    // 课程周期范围
                    weekRange = courseData.week.split('-'),

                    // 不在周期内
                    outRange = (currWeek < weekRange[0] || currWeek > weekRange[1]) || false;

                // 课程是否可视
                courseData.display = true;

                // 课程状态
                courseData.state = true;

                // 单周时双周的课 双周时单周的课 不在周期内的课 不用上
                if ((weekRange[2] === '1' && currWeek % 2 === 0) || (weekRange[2] === '2' && currWeek % 2 === 1) || outRange) {
                    courseData.state = false;
                }

                // 同一时间段不同周有不同的课 # 1-15周(单),2-16周(双) / 1-3周(单),4-16周
                if (course.index !== 0) {
                    // 当前课程不在周期内的话 隐藏自己
                    if (outRange) {
                        courseData.display = false;
                        continue;
                    }

                    let flag = false;
                    for (let i = 0; i < course.index; i++) {
                        let siblingCourseData = section.data[i].data;

                        // 隔壁课程需要上 或者他们是连上课程 那就说明当前课程不用上
                        if ((siblingCourseData.display === true && siblingCourseData.state === true) || siblingCourseData.forwardFrom !== undefined) {
                            courseData.display = false;
                            flag = true;
                            continue;
                        }

                        // 隔壁课程不用上 那就隐藏它
                        if (siblingCourseData.state === false) {
                            siblingCourseData.display = false;
                        }
                    }

                    // 如果已有需要上的课程 即可跳过本次循环
                    if (flag) {
                        continue;
                    }
                }

                // 处理连上课程
                let previousSectionIndex = sectionIndex - 1,
                    previousSection = day.data[previousSectionIndex];
                if (previousSection) {
                    let currentValue = courseData.name + courseData.teacher + courseData.room + courseData.state,
                        previousValue = '',
                        flag = false;

                    for (let tmpCourse of previousSection.data) {
                        let previousCourseData = tmpCourse.data;
                        previousValue = previousCourseData.name + previousCourseData.teacher + previousCourseData.room + previousCourseData.state;

                        // 如果前一节课和本节课不同 跳过
                        if (previousValue !== currentValue) {
                            continue;
                        }

                        // 此时 前一节课和本节课相同 如果同时都是显示状态 就是连上课程
                        
                        // 如果前一节课没有 forwardFrom（表明不是和前一节的前一节课连上） 而它又是不可见状态 跳过
                        if (previousCourseData.forwardFrom === undefined && previousCourseData.display === false) {
                            continue;
                        }

                        // 隐藏当前课程
                        courseData.display = false;

                        // 给当前课程打标记 第几节开始的课
                        courseData.forwardFrom = previousCourseData.forwardFrom !== undefined ? previousCourseData.forwardFrom : previousSectionIndex;

                        // 修改连上课程的高度
                        let startSection = day.data[courseData.forwardFrom];
                        for (let tmpCourse of startSection.data) {
                            // 因为前面那个时间段可能不止一门课 所以用循环找出目标

                            let startCourseData = tmpCourse.data;
                            if (startCourseData.display === true) {
                                // 每个课程块高度 200  间隔 10 # 例如 两节连上的话高度就为 410
                                // 第六大节如果是连上课程 说明和第五大节连上 目前来看只有 9-11 的情况 所以高度为 100
                                startCourseData.height = (sectionIndex - courseData.forwardFrom) * 210 + (section.index === 6 ? 100 : 200);
                                continue;
                            }
                        }

                        // 完成操作 跳出循环
                        flag = true;
                        continue;
                    }

                    // 如果当前课程是连上课程 即可跳过本次循环
                    if (flag) {
                        continue;
                    }
                }

                // 处理节次偏移
                if (courseData.offset) {
                    courseData.offset = courseData.offset === 1 ? 0 : 100;
                    courseData.height = 100;
                }

                // 课程背景色 # 不在周期内的课程没有背景色 即默认的灰色
                if (! outRange && courseData.state) {
                    // 当前周大于等于起始周 小于等于结束周

                    // 每门课一种颜色 # 以课程名字当索引
                    let bgKey = courseData.name;
                    scheduleBg[bgKey] = scheduleBg[bgKey] || palette[paletteIndex++ % palette.length];

                    courseData.bg = scheduleBg[bgKey];
                }
            }

            // 节次结束 下标自增
            sectionIndex++;
        }
    }

    let res = {
        schedule,
        weekTitle
    };

    console.log('课表渲染结束：', res);

    return res;
}

// 获取学校时间 # 年级 学期 学年
function getSchoolTime({grade, semester} = {}) {
    const DATE = new Date(),
        CURR_YEAR = DATE.getFullYear(),
        CURR_MONTH = DATE.getMonth() + 1,
        ENROLLMENT_YEAR = 2000 + parseInt(app.cache.stu.id.substr(2, 2));

    if (grade === undefined) {
        grade = CURR_YEAR - ENROLLMENT_YEAR;
        if (CURR_MONTH > 8) {
            grade++;
        }
    }

    semester = semester || (CURR_MONTH < 3 || CURR_MONTH > 8 ? 1 : 2);

    // 年级 # 1-5 分别表示 大一至大五
    // 学期 # 1 秋季  2 春季
    // 学年 # 从入学年份到当前年份
    return {
        grade,
        gradeName: app.lang.score_grade[grade - 1],
        semester,
        semesterName: app.lang.score_semester[semester - 1],
        year: ENROLLMENT_YEAR,
        yearGroup: app.util.getNumArr(grade, ENROLLMENT_YEAR),
    };
}

// 处理成绩
function processScore(data) {
    let res = [{
            unique: 'scoreTitle',
            data: app.lang.score_table_title,
        }];

    for (let item of data) {
        res.push({
            unique: 'scoreTitle' + item[0],
            data: item,
        });
    }

    return res;
}

function getTimeTable(sectionIndex, course) {
    const TIME_TABLE = [
            ['08:20', '09:05'],
            ['09:15', '10:00'],
            [['10:20', '10:30'], ['11:05', '11:15']],
            [['11:15', '11:25'], ['12:00', '12:10']],
            ['14:00', '14:45'],
            ['14:55', '15:40'],
            ['16:00', '16:45'],
            ['16:55', '17:40'],
            ['18:40', '19:25'],
            ['19:35', '20:20'],
            ['20:30', '21:15']
        ],
        TIME_TABLE_SPORT = [
            ['18:00', '19:30'],
            ['19:30', '21:00']
        ];

    let sectionCount = (course.height === undefined || course.height === 100) ? 1 : Math.floor(course.height / 200),
        hasSmallSection = (course.height && course.height % 200 > 100) ? true : false;

    let sectionGroup = [],
        smallSection = sectionIndex * 2 - 1;

    for (let i = 0; i < sectionCount; i++) {
        sectionGroup.push([smallSection + 2 * i, smallSection + 1 + 2 * i]);
    }

    if (hasSmallSection) {
        let tmp = (sectionIndex + sectionCount - 1) * 2 + 1;
        sectionGroup.push([tmp, tmp]);
    }

    if (course.offset !== undefined) {
        if (course.offset === 0) {
            sectionGroup[0][1]--;
        } else {
            sectionGroup[0][0]++;
        }
    }

    let isFast = course.room.match(/二教|实验|室/g) === null;

    let resValue = [];

    for (let section of sectionGroup) {
        let startTime, endTime;

        if (section[0] === 11 && section[1] === 12) {
            startTime = TIME_TABLE_SPORT[1][0];
            endTime = TIME_TABLE_SPORT[1][1];
        } else if (section[0] === 9 && section[1] === 10 && course.name.match(/球|健美|体育|武术|太极|散打|游泳/g) !== null && course.name !== '高尔夫球导程') {
            startTime = TIME_TABLE_SPORT[0][0];
            endTime = TIME_TABLE_SPORT[0][1];
        } else {
            startTime = TIME_TABLE[section[0] - 1][0];
            endTime = TIME_TABLE[section[1] - 1][1];

            if (section[0] === 3 || section[0] === 4) {
                startTime = isFast ? startTime[0] : startTime[1];
                endTime = isFast ? endTime[0] : endTime[1];
            }
        }

        resValue.push(startTime + '-' + endTime)
    }

    return resValue.join(' ');
}

module.exports = {
    processSchedule,
    renderSchedule,
    getSchoolTime,
    processScore,
    getTimeTable,
};
