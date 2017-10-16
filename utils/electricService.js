let app = getApp();

// 获取宿舍信息
function getDormInfo(newData) {
    let dorm = newData || app.cache.dataDorm || {},
        dormTip = {
            default: {
                content: app.lang.elec_room_default,
                color: ' green'
            },
            other: {
                content: app.lang.elec_room_other,
                color: ' red'
            }
        };

    return {
        id: dorm.id || '',
        name: dorm.fullName || 'N/A',
        tip: (dorm.id && app.cache.dataDorm && (dorm.id === app.cache.dataDorm.id) ? dormTip.default : dormTip.other)
    };
}

// 根据房间编号生成宿舍相关信息
function processDorm(data) {
    let res = {};

    if (data && data.length === 6) {
        res = {
            garden: parseInt(data.substr(0, 1)),
            building: parseInt(data.substr(1, 2)),
            room: parseInt(data.substr(3, 3))
        };

        // 下标从零开始 所以减一
        res.buildingName = app.lang.elec_setting_garden[res.garden - 1] + ' ' + res.building;

        res.fullName = res.buildingName + ' # ' + res.room;
    }

    res.id = data || '';

    return res;
}

// 处理宿舍历史记录 # 用于快速选择宿舍
function processDormHistory(data, defaultDorm) {
    let dorm = defaultDorm || app.cache.dataDorm || {},
        res = [];

    // 默认宿舍排第一位
    if (dorm.id) {
        res.push(dorm.id);
    }

    // 加入新记录
    res.push(data);

    // 加入旧记录
    res.push.apply(res, (app.cache.dataDormHistory || []));

    // 去重 然后返回最多前六个数据
    return Array.from(new Set(res)).slice(0, 6);
}

// 处理宿舍用电数据
function processDormConsume(data) {
    let res = {
            detail: [{
                unique: 'dormConsumeTitle',
                data: app.lang.elec_record_dorm_consume_table_title
            }]
        };

    for (let item of data.data) {
        res.detail.push({
            unique: 'dormConsume' + item[0],
            data: item
        });
    }

    res.remain = data.info.remain;
    res.avg = data.info.avg;
    res.expect = data.info.expect;

    return res;
}

// 处理宿舍购电数据
function processDormRecharge(data) {
    let res = [{
            unique: 'dormRechargeTitle',
            data: app.lang.elec_record_dorm_recharge_table_title
        }];

    for (let item of data) {
        // 处理时间戳 # JavaScript 的时间戳单位是毫秒 需要乘以一千
        item[0] = app.util.formatTime(item[0] * 1000);

        item[1] = '￥' + item[1];

        res.push({
            unique: 'dormRecharge' + item[0],
            data: item
        });
    }

    return res;
}

// 处理用户购电数据
function processUserRecharge(data) {
    let label = app.lang.elec_record_user_recharge_label,
        res = [],
        time = '';

    for (let item of data) {
        // 处理时间戳 # JavaScript 的时间戳单位是毫秒 需要乘以一千
        time = app.util.formatTime(item[0] * 1000);

        res.push({
            unique: 'userRecharge' + time,
            data: {
                head: {label: label[0], value: '￥' + item[1]},
                body: [
                    {unique: 'data1' + time, label: label[1], value: item[2]},
                    {unique: 'data2' + time, label: label[2], value: time}
                ]
            }
        });
    }

    return res;
}

module.exports = {
    getDormInfo,
    processDorm,
    processDormHistory,
    processDormConsume,
    processDormRecharge,
    processUserRecharge
};
