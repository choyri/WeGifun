let host = 'https://www.test.com',
    config = {
        // 教务管理系统帐号验证
        eduAuthURL: host + '/test1',

        // 课表
        eduScheduleURL: host + '/test2',

        // 成绩
        eduScoreURL: host + '/test10',

        // 校园卡帐号验证
        cardAuthURL: host + '/test3',

        // 校园卡余额
        cardBalanceURL: host + '/test4',

        // 校园卡消费记录
        cardRecordURL: host + '/test5',

        // 宿舍编号
        dormURL: host + '/test6',

        // 电费充值
        elecRechargeURL: host + '/test7',

        // 电费记录
        elecRecordURL: host + '/test8',

        // 电费余量
        elecRemainURL: host + '/test9',

        // 图书检索
        bookSearchURL: host + '/test10',

        // 图书详情
        bookInfoURL: host + '/test11',

        // 小程序版本
        version: 'v0.6.6',

        // 新版本强制清理本地数据缓存
        clearStorage: false,

        quote: '那只敏捷的棕毛狐狸跃过那只懒狗。',
        qqGroup: '10001'
    };

module.exports = config;
