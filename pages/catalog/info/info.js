let app = getApp(),
    bookService = require('../../../utils/bookService.js'),
    request = require('../../../utils/request.js'),
    pageParams = {
        data: {
            text: {
                metaName: app.lang.catalog_info_meta,
                collectionName: app.lang.catalog_info_collection,
                collectionState: app.lang.catalog_info_collection_state,
            },
        },
        tmp: {},
    };

pageParams.onLoad = function (e) {
    let book = app.cache.books[e.marc];
    this.oopBook(book);
    this.setData({book});
};

pageParams.onReady = function () {
    if (! app.lang.isCN) {
        wx.setNavigationBarTitle({
            title: app.lang.catalog_info
        });
    }

    this.renderPage();
};

pageParams.renderPage = function () {
    request.getBookInfo({
        marc: this.oopBook().marc,
    }, res => {
        bookService.processCollection(res.data.collection);
        this.setData({bookInfo: res.data});
    });
};

pageParams.bindCopy = function (e) {
    // 基础库 1.1.0 开始支持
    if (! wx.setClipboardData) {
        return;
    }

    wx.setClipboardData({
        data: e.currentTarget.dataset.text || '',
        success() {
            wx.showToast({title: app.lang.about_copy_success});
        },
    });
};

pageParams.oopBook = function (value) {
    if (value === undefined) {
        return this.tmp.book || {};
    }
    this.tmp.book = value;
};

Page(pageParams);
