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
        palette = ['#3399CC', '#669999', '#CC9966', '#FF6666', '#666699', '#33CC99', '#996666', '#FF99CC', '#99CC33', '#666633', '#663366', '#CC3366'],

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
                    let currentValue = courseData.name + courseData.week + courseData.room,
                        previousValue = '',
                        flag = false;

                    for (let tmpCourse of previousSection.data) {
                        let previousCourseData = tmpCourse.data;

                        previousValue = previousCourseData.name + previousCourseData.week + previousCourseData.room;

                        // 如果前一节需要上的课和本节课相同 或者前一节是连上课程
                        if ((previousCourseData.display === true && currentValue === previousValue) || previousCourseData.forwardFrom !== undefined) {
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
                                    // 每个课程块高度 200  间隔 10 # 例如 两节连上的话高度就为 410 # 最后一节高度 100
                                    startCourseData.height = (sectionIndex - courseData.forwardFrom) * 210 + (section.index === 6 ? 100 : 200);
                                    continue;
                                }
                            }

                            // 完成操作 跳出循环
                            flag = true;
                            continue;
                        }
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

module.exports = {
    processSchedule,
    renderSchedule
};
