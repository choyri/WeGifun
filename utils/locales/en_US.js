const string = {
  changelog: [
    'New: Light up schedule',
    'Fix: Inconsistent schedule header bar width.',
  ],

  feature: '✨ Now you can light up the schedule. Turn it on in the Settings page.',

  global: {
    btn_title: 'Confirm',
    dev: 'Dev mode',
    loading: 'Loading',
    logout: 'The cache has been cleared, if you want to continue using it, please clean up the application background and reopen it, otherwise there will be some errors.',
    modal_confirm: 'OK',
    modal_cancel: 'Late',
    new_feature: 'New Feature',
    request_failed: 'Network request failed, please try again later.',
    service_unavailable: 'Service Unavailable, please try again later.',
    tip: 'Tip',
    title: 'WeGifun',
    updateManager: 'The new version is ready, do you want to restart the application?',
  },

  services: {
    card: 'Campus Card',
    cet_ticket: 'CET Admission Ticket',
    edu_calendar: 'Teaching Calendar',
    edu_schedule: 'Class Schedule',
    edu_score: 'Course Score',
    elec: 'Dorm Electricity',
    opac: 'OPAC',
  },

  tip: {
    bind_edit: 'If the password has changed, you can enter the new password to rebind.',
    bind_new: 'The ID is the student/job id; you can choose to enter one or more passwords, no binding without input.',
    cet_fill: 'If you have bound the education account, you can get and fill in the relevant information with one click.',
    guide: 'Welcome to use, whether to read the guide?',
    schedule: 'Swipe left or right to switch weeks, double-click to return to the current week, long press to enter the customize schedule page.',
    score: 'On the left is the course name, nature, and credits. On the right is the score and grade point.',
  },

  component_schedule: {
    at_border: 'At the boder',
    currWeek: 'No\n{0}',
    detail_week: ['Week {0}', 'Odd week', 'Even week'],
    weekName: ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
  },

  component_schoolTime: {
    grade: ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Fifth year'],
    label: 'Select the semester',
    semester: ['First Semester', 'Second Semester'],
  },

  tabbar: {
    discover: 'Discover',
    schedule: 'Schedule',
    me: 'Me',
  },

  tabbar_discover: {
    bind_card: 'Please bind the campus card account first',
    bind_edu: 'Please bind the education account first',
    schedule_list: ['Update Schedule', 'Customize Schedule'],
  },

  tabbar_me: {
    default_nickname: 'Gifuner',
    menu_about: 'About',
    menu_bind: 'Bind',
    menu_feedback: 'Suggestions & Feedback',
    menu_guide: 'Guide',
    menu_reward: 'Reward',
    menu_setting: 'Settings',
    menu_share: 'Share with friends',
    unbind: 'Unbind',
  },

  common_about: {
    changelog: 'Changelog',
    changelog_history: 'History changelog please refer to',
    communication: 'Communication',
    communication_content: 'Welcome to join the QQ Group',
    open_source: 'Open Source',
    security: 'Security and Privacy',
    security_content: [
      'The username and password you entered when you logged in will be stored locally on your phone, and the server will not save it.',
      'Each time the various services are used, the username and password are carried through the HTTPS encrypted channel to interact with the server.',
      'The server will store some data anonymously (not include password) for statistics and caching.',
      'This program is a third-party application, if you do not trust me, please DO NOT USE it.',
    ],
    title: 'About',
  },

  common_bind: {
    error_id: 'Please check the username',
    error_pwd: 'Please check the password(s)',
    error_card: 'Please check the card password',
    error_edu: 'Please check the edu password',
    id: 'ID',
    pwd_card: 'Card Password',
    pwd_edu: 'Edu Password',
    title: 'Bind',
    unchange: 'Unchange',
    get_schedule: 'Get the class schedule at the same time?',
  },

  common_guide: {
    content: [
      'The user system of the Education System and the Campus Card System is different. The two usernames are the same, but the passwords are different. Therefore, different user systems need to be bound when using different functions.',
      'Because the original intention of the application is the schedule, the homepage will always be it, no matter how it is updated.',
      'On the schedule page, swipe left or right to switch weeks, double-click to return to the current week, long press to enter the customize schedule page.',
      'Light up schedule will keep the course table from graying out at any time.',
      'The time in the course info is calculated by myself, and it is not 100% accurate. If you happen to meet the mistaken course, I sincerely await your feedback.',
      'As a third-party application, I will voluntarily answer some questions in the customer service message; but similar to “Why is there no elctric supply long time after depositing?”, please look for Dorm Aunt.',
      'For security and privacy issues, see the About page.',
      'Welcome the subject of non-commercial Subscription Account to contact me binding this mini program.',
    ],
    title: 'Guide',
  },

  common_setting: {
    authorization: 'Authorization',
    language: 'Language',
    language_list: ['Auto', '简体中文', 'English'],
    language_tip: 'This setting item will take effect after clean the mini program background process and restart it.',
    logout: 'Log Out',
    logout_tip: 'It will clear all local cache, continue?',
    schedule_bg: {
      choose: 'Choose Image',
      style: 'Style',
      title: 'Schedule Background',
    },
    schedule_date: 'Show date on schedule page',
    schedule_hide_course: 'Hide the courses which are not in this week',
    schedule_light_up: 'Light up schedule',
    schedule_bg_exit: 'Schedule Background is not set, re-close.',
    schedule_bg_style: ['Original', 'Mask', 'Blur'],
    title: 'Settings',
  },

  service_edu_schedule: {
    empty_schedule: 'There is no schedule for the target semester',
    title: 'Class Schedule',
  },

  service_edu_schedule_custom: {
    'delete_confirm': 'Confirm delete?',
    'error_incomplete': 'Incomplete information',
    'error_repeat': 'Duplicate with existing custom courses',
    'form_field': ['Time', 'Week', 'Name', 'Classroom', 'Teacher'],
    'form_section_list': ['Section 1', 'Section 2', 'Section 3', 'Section 4', 'Section 5', 'Section 6'],
    'form_section_half_list': ['Normal', 'First half', 'Second half'],
    'form_title': 'Fill in the course information',
    'form_week_list': ['Normal', 'Odd', 'Even'],
    'handle_delete': 'Delete',
    'list_title': 'Added courses',
    'success': 'Added successfully',
    'title': 'Customize Schedule',
  },

  service_edu_score: {
    noRecord: 'No Record',
    title: 'Course Score',
  },

  service_card: {
    balance: 'My Balance',
    record: 'Records',
    title: 'Campus Card',
    witticism: 'You are fifty cents and I am fifty cents, so we will be together!',
  },

  service_card_record: {
    date_label: 'Choose Date Range',
    noRecord: 'No Record',
    result_conclusion: '{0} record(s), {1} CNY.',
    result_label: ['Amount', 'Area', 'Platform', 'Time'],
    title: 'Records',
  },

  service_elec: {
    balance: 'Balance (kW·h)',
    deposit: 'Deposit',
    dorm_null: 'Please set up the dorm for the first time',
    exit: 'This function cannot be used without a dorm.',
    record: 'Records',
    title: 'Dorm Electricity',
  },

  service_elec_deposit: {
    check: 'Check',
    check_tip: 'The Check Info comes from the Electricity Control Server. Do Not Deposit if it does not correspond to the dorm you choose.',
    confirm: 'Will deposit {1} CNY for {0}, sure?',
    custom: 'Custom',
    deposit_tip: 'This app only help you to deposit, if more than half an hour without power supply, please contact the dorm aunt.',
    error_amount: 'Please check the amount',
    error_auth: 'Please check the password',
    prove_tip: 'Prove you are you',
    pwd: 'Campus Card Password',
    soter_fail: 'Fingerprint verification is abnormal, please use the password to re-verify.',
    success: 'Deposit Success',
    title: 'Deposit',
  },

  service_elec_record: {
    dorm_consume_info: ['Balance / kW·h', 'Avg / kW·h', 'Expect / Days'],
    dorm_consume_table_title: ['Date', 'kW·h', 'CNY'],
    dorm_deposit_title: 'Records of nearly two months',
    dorm_deposit_null: 'There was no record for nearly two months',
    tab_title: ['Dorm Consume', 'Dorm Deposit', 'User Deposit'],
    title: 'Records',
    user_deposit_tip: 'If you make a mistake, try to contact s/he!',
    user_deposit_label: ['Amount', 'Dorm', 'Time'],
  },

  service_elec_setting: {
    dorm_label_update: 'Choose the default dorm you want',
    dorm_label_retrieve: 'Choose the dorm you want to look over',
    dorm_garden: ['Zhu', 'Gui', 'Mei', 'Rong', 'Kang', 'Song', 'Zonghe'],
    dorm_null: 'The dorm does not exist',
    dorm_state_default: 'Default Dorm',
    dorm_state_other: 'Other Dorm',
    dorm_unchange: 'Unchange',
    history: 'History',
    room_invalid: 'Invalid room',
    title: 'Settings',
  },

  service_opac_search: {
    book_amount: 'Total {0} / Available {1}',
    conclusion: '{0} result(s)',
    no_more: 'No More',
    title: 'OPAC',
  },

  service_opac_book: {
    meta: ['Author', 'Publisher', 'ISBN', 'Call number', 'Location', 'Collection Info', 'Douban Book'],
    collection: ['Barcode', 'State'],
    collection_null: 'This publication may be in the process of ordering or processing.',
    collection_state: ['Read', 'Borrowable', 'Waiting: {0}'],
    title: 'Book Info',
  },

  service_cet_ticket: {
    bind: 'Please bind the education account first',
    error_input: 'Please check the input values',
    idcard: 'ID Card Number',
    name: 'Name',
    page_title: 'Query Admission Ticket ID',
    quick_fill: 'Quick Fill',
    result: 'Query result: {0}\n[Copied, can be used directly paste]',
    title: 'CET Admission Ticket',
  },
}

export default string
