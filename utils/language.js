let currLang = wx.getSystemInfoSync().language || 'zh_CN';
currLang = currLang.indexOf('zh') > -1 ? 'zh_CN' : 'en_US';

let lang = require('./language/' + currLang + '.js');

lang.changelog = require('./changelog.js')[currLang];

module.exports = lang;
