// 不足两位则补全前导零 # e.g. 1 → 01
function padNum(n) {
    n = n.toString();
    return n.length > 1 ? n : '0' + n;
}

// 处理时间戳 返回日期 # e.g. 2017-01-01
function disposeDate(timestamp) {
    return ([timestamp.getFullYear(), timestamp.getMonth() + 1, timestamp.getDate()]).map(padNum).join('-');
}

// 格式化时间戳 返回日期时间 # e.g. 2017-01-01 12:00:00
// smart: 是否智能处理日期 同一天省略日期 同一年省略年份 否则完整显示日期
function formatTime(time, smart = true) {
    let todayTmp = disposeDate(new Date()),
        target = new Date(time),
        targetTmp = disposeDate(target),
        res = '';

    if (smart) {
        if (todayTmp == targetTmp) {
            // 如果年月日相同则不显示日期
            targetTmp = '';
        } else {
            // 否则显示日期 那么应该在日期和时间中间加空格
            targetTmp += ' ';

            // 如果年份相同 去除年份 # e.g. 2017 - 01-01
            if (todayTmp.substr(0, 4) == targetTmp.substr(0, 4)) {
                targetTmp = targetTmp.substr(5) + ' ';
            }
        }
    }

    res = targetTmp;

    return res + ([target.getHours(), target.getMinutes(), target.getSeconds()]).map(padNum).join(':');
}

// 返回指定长度的自然数数组
// start: 下标从何开始
function getNumArr(length, start = 0) {
    return Array.from({length}, (v, k) => k + start);
}

// 计算指定天数前的日期 并以 [开始日期, 今天日期] 数组形式返回
function getRecentDate(len = 7) {
    let endDate = new Date();

    let tmp = endDate.getTime() - 1000 * 60 * 60 * 24 * len,
        startDate = new Date(tmp);

    return [disposeDate(startDate), disposeDate(endDate)];
}

module.exports = {
    padNum,
    formatTime,
    getNumArr,
    getRecentDate
};
