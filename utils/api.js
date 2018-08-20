import config from '../config'

const url = {
  // 微信登录
  wechatLogin: '/wechat/login',

  // 公告
  notice: '/notice',

  // 宿舍
  dorm: '/dorm',
  dormCheck: '/dorm/{id}',

  // 教务管理系统
  eduAuth: '/edu/auth',
  eduStartDate: '/edu/date',
  eduSchedule: '/edu/schedule',
  eduScore: '/edu/score',
  eduUserInfo: '/edu/user',

  // 校园一卡通
  cardAuth: '/card/auth',
  cardBalance: '/card/balance',
  cardRecord: '/card/record',

  // 校园一卡通拓展
  excardElecDeposit: '/excard/elec/deposit',
  excardElecRecord: '/excard/elec/record',

  // 用电
  elecBalance: '/elec/balance',
  elecRecordConsumption: '/elec/record/consumption',
  elecRecordDeposit: '/elec/record/deposit',

  // OPAC
  opacSearch: '/opac/search',
  opacHandShake: '/opac/handshake',
  opacBook: '/opac/book',

  // CET
  cetTicket: '/cet/ticket',
}

let host = wx.getSystemInfoSync().platform === 'devtools' ? config.host.dev : config.host.prod
console.log('当前 host', host)

export default function (key) {
  if (wx.ooCache.dev) {
    host = config.host.dev
    console.log('当前 host 已切换到开发式', host)
  }

  return host + url[key]
}
