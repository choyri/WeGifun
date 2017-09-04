let currLang = wx.getSystemInfoSync().language || 'zh_CN',
    isCN = true,
    lang = null;

if (currLang.indexOf('zh') > -1) {
    currLang = 'zh_CN';
} else {
    currLang = 'en_US';
    isCN = false;
}

lang = require('./language/' + currLang + '.js');

lang.changelog = require('./changelog.js')[currLang];
lang.isCN = isCN;

module.exports = lang;
