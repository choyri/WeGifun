const string = {
  changelog: [
    '修复 书目检索图书信息页链接地址复制无效',
    '修复 生物认证接口的几个问题',
  ],

  feature: '修复了指纹验证的几个问题。',

  global: {
    btn_title: '确定',
    dev: '开发模式',
    loading: '稍候',
    logout: '缓存已清除，如果你要继续使用，请清理该应用后台再重新打开，否则会出错。',
    modal_confirm: '确定',
    modal_cancel: '不了',
    new_feature: '新版特性',
    request_failed: '网络请求失败，请稍后重试。',
    service_unavailable: '服务不可用，请稍后重试。',
    tip: '提示',
    title: '微吉风',
    updateManager: '新版本已经准备好，是否重启应用？',
  },

  services: {
    card: '校园卡',
    cet_ticket: 'CET 准考证',
    edu_calendar: '教学日历',
    edu_schedule: '课表',
    edu_score: '课程成绩',
    elec: '宿舍电费',
    opac: '书目检索',
  },

  tip: {
    bind_edit: '如果密码已更改，可以输入新密码重新绑定。',
    bind_new: '帐号即学（工）号；你可以自主选择输入一项或多项密码，不输入不会绑定。',
    cet_fill: '如果已绑定教务系统帐户，可一键获取并填写相关信息。',
    guide: '欢迎使用，是否查看使用指南？',
    score: '左边是课程名称、性质、学分，右边是成绩、绩点。',
  },

  component_schedule: {
    at_border: '到头了',
    currWeek: '{0}\n周',
    detail_week: ['{0} 周', '单', '双'],
    weekName: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },

  component_schoolTime: {
    grade: ['大一', '大二', '大三', '大四', '大五'],
    label: '选择学期',
    semester: ['第一学期', '第二学期'],
  },

  tabbar: {
    discover: '发现',
    schedule: '课表',
    me: '我',
  },

  tabbar_discover: {
    bind_card: '请先绑定校园卡帐户',
    bind_edu: '请先绑定教务系统帐户',
    update_schedule: '获取最新课表？',
  },

  tabbar_me: {
    default_nickname: '小吉风',
    menu_about: '关于',
    menu_bind: '绑定',
    menu_feedback: '建议与反馈',
    menu_guide: '使用指南',
    menu_reward: '赞赏',
    menu_setting: '设置',
    menu_share: '分享给好友',
    unbind: '未绑定',
  },

  common_about: {
    changelog: '更新日志',
    changelog_history: '历史更新记录请查阅',
    communication: '交流',
    communication_content: '欢迎加入 QQ 群',
    open_source: '开源',
    security: '安全与隐私',
    security_content: [
      '你登录时所输入的帐号和密码会储存于手机本地，服务端不保存。',
      '每次使用各项服务时，会携带帐号与密码通过 HTTPS 加密通道与服务端进行交互。',
      '服务端会保存部分数据（不包括明文密码），用于统计以及缓存。',
      '本程序是第三方应用，如果对我不放心，请不要使用这个小程序。',
    ],
    title: '关于',
  },

  common_bind: {
    error_id: '请检查帐号',
    error_pwd: '请检查密码',
    error_card: '请检查校园卡密码',
    error_edu: '请检查教务密码',
    id: '帐号',
    pwd_card: '校园卡密码',
    pwd_edu: '教务密码',
    title: '绑定',
    unchange: '无变动',
    get_schedule: '是否同时获取课表？',
  },

  common_guide: {
    content: [
      '教务管理系统和校园卡系统的用户体系不同，二者帐号一致，但密码不同。所以，使用不同的功能时需要绑定不同的用户体系。',
      '因为该应用的初衷是课表，所以不管怎么更新，首页会一直是它。',
      '在课表页，左右滑动可以切换周数，长按恢复。',
      '课程信息中的时间是我个人统计的，并不百分百准确，如果你碰巧遇到了有误的课程，衷心等待你的反馈。',
      '作为第三方应用，我会义务地在客服消息里解答一些问题；但类似于「为什么充了电费等很久还是没有来电」，请找宿管阿姨。',
      '安全与隐私问题，详见「关于」页。',
      '如果你是非商业性质公众号的主体，对该应用有兴趣的话可以联系我绑定噢。',
    ],
    title: '使用指南',
  },

  common_setting: {
    authorization: '授权',
    language: '语言',
    language_list: ['自动', '简体中文', 'English'],
    language_tip: '该设置项会在清理小程序后台并重新打开后生效。',
    logout: '退出',
    logout_tip: '该操作会清空本地缓存，是否继续？',
    schedule_bg: {
      choose: '选择图片',
      style: '样式',
      title: '课表背景',
    },
    schedule_date: '课表页显示日期',
    schedule_hide_course: '隐藏非本周课程',
    schedule_bg_exit: '课表背景图片未设置，重新关闭',
    schedule_bg_style: ['原图', '半透明遮罩', '高斯模糊'],
    title: '设置',
  },

  service_edu_schedule: {
    title: '课表',
  },

  service_edu_score: {
    noRecord: '没有记录',
    title: '课程成绩',
  },

  service_card: {
    balance: '我的余额',
    record: '消费记录',
    title: '校园卡',
    witticism: '你五毛我五毛，那么咱俩就一块啦。',
  },

  service_card_record: {
    date_label: '选择日期区间',
    noRecord: '没有记录',
    result_conclusion: '{0} 条记录，{1} 元。',
    result_label: ['金额', '区域', '平台', '时间'],
    title: '消费记录',
  },

  service_elec: {
    balance: '余量（度）',
    deposit: '充值',
    dorm_null: '第一次使用请先设置宿舍',
    exit: '不设置宿舍的话将无法使用这项功能。',
    record: '记录',
    title: '宿舍电费',
  },

  service_elec_deposit: {
    check: '核对',
    check_tip: '核对信息来自电控服务端，如果与你所选择的宿舍不对应，请勿充值。',
    confirm: '将为 {0} 充值 {1} 元，确定？',
    custom: '自定义',
    deposit_tip: '本应用只是代充值，如果超过半小时未送电，请联系宿管阿姨。',
    error_amount: '请检查金额',
    error_auth: '请检查密码',
    prove_tip: '证明你是你',
    pwd: '请输入校园卡密码',
    soter_fail: '指纹验证出现异常，请使用密码重新验证。',
    success: '充值成功',
    title: '充值',
  },

  service_elec_record: {
    dorm_consume_info: ['余量 · 度', '日均 · 度', '可用 · 天'],
    dorm_consume_table_title: ['日期', '度', '元'],
    dorm_deposit_title: '近两个月的记录',
    dorm_deposit_null: '近两个月一次充值记录都没有',
    tab_title: ['宿舍用电', '宿舍购电', '用户购电'],
    title: '记录',
    user_deposit_tip: '如果充错，就想办法联系上对方吧！',
    user_deposit_label: ['金额', '房间', '时间'],
  },

  service_elec_setting: {
    dorm_label_update: '选择你要的默认宿舍',
    dorm_label_retrieve: '选择你要查看的宿舍',
    dorm_garden: ['竹', '桂', '梅', '榕', '康', '松', '综合'],
    dorm_null: '不存在该宿舍',
    dorm_state_default: '默认宿舍',
    dorm_state_other: '其他宿舍',
    dorm_unchange: '无变动',
    history: '历史记录',
    room_invalid: '无效的房间号',
    title: '设置',
  },

  service_opac_search: {
    book_amount: '馆藏 {0} / 可借 {1}',
    conclusion: '{0} 条结果',
    no_more: '没有更多',
    title: '书目检索',
  },

  service_opac_book: {
    meta: ['作者', '出版商', 'ISBN', '索书号', '馆藏地', '馆藏信息', '豆瓣图书'],
    collection: ['条码号', '书刊状态'],
    collection_null: '此书刊可能正在订购中或者处理中。',
    collection_state: ['阅览', '可借', '待还：{0}'],
    title: '图书信息',
  },

  service_cet_ticket: {
    bind: '请先绑定教务系统帐户',
    error_input: '请检查输入值',
    idcard: '身份证号码',
    name: '姓名',
    page_title: '查询准考证号',
    quick_fill: '快速填写',
    result: '查询结果：{0}\n[已复制，可直接粘贴使用]',
    title: 'CET 准考证',
  },
}

export default string
