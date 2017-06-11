// 处理课表数据
function processSchedule(data) {
    let schedule = data.schedule;

    // 将数组转换成对象
    for (let key in schedule) {
        for (let subKey in schedule[key]) {
            for (let subSubKey in schedule[key][subKey]) {
                let tmp = schedule[key][subKey][subSubKey];
                schedule[key][subKey][subSubKey] = {
                    'name': tmp[0],
                    'week': tmp[1],
                    'teacher': tmp[2],
                    'room': tmp[3]
                };
            }
        }
    }

    return {
        updateTime: (new Date()).getTime(),
        termBegin: data.termBegin,
        schedule
    };
}

module.exports = {
    processSchedule
};
