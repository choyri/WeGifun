// 处理课表数据
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

module.exports = {
    processSchedule
};
