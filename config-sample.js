let host = 'https://www.test.com',
    config = {
        // 教务管理系统帐号验证
        jwVerifyURL: host + '/test1',

        // 课表
        jwScheduleURL: host + '/test2',

        // 校园卡帐号验证
        cardVerifyURL: host + '/test3',

        // 校园卡余额
        cardBalanceURL: host + '/test4',

        // 校园卡消费记录
        cardRecordURL: host + '/test5',

        // 反馈
        feedbackURL: host + '/test6',

        quote: '那只敏捷的棕毛狐狸跃过那只懒狗。',

        // 小程序版本
        version: 'v0.1.0',
    };

module.exports = config;
