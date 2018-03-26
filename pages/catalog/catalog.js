let app = getApp(),
    bookService = require('../../utils/bookService.js'),
    request = require('../../utils/request.js'),
    pageParams = {
        data: {
            searchValue: '',
            showClear: false,
            showHead: true,
        },
        tmp: {},
    };

pageParams.onReady = function () {
    if (! app.lang.isCN) {
        wx.setNavigationBarTitle({
            title: app.lang.catalog
        });
    }
};

pageParams.onReachBottom = function () {
    if (this.data.hasMore === false) {
        console.log('刷新结束');
        return;
    }

    console.log('触底刷新');

    this.searchBook(this.oopCurrSearch());
};

pageParams.bindClear = function () {
    this.oopCurrSearch('');
    this.setData({
        searchValue: '',
        showClear: false,
    });
};

pageParams.bindConfirm = function () {
    this.bindSearch();
}

pageParams.bindInput = function (e) {
    this.oopCurrSearch(e.detail.value);

    let showClear = e.detail.value !== '';
    if (this.data.showClear !== showClear) {
        this.setData({showClear});
    }
};

pageParams.bindSearch = function () {
    let q = this.oopCurrSearch(),
        lq = this.oopLastSearch();

    if (q === '' || q === lq) {
        return;
    }

    if (lq !== '') {
        this.oopBooks([], true);
        this.oopNextPage(0);
        this.oopPageHeight(0);
    }

    this.searchBook(q);
};

pageParams.searchBook = function (q) {
    let requestArg = {q},
        p = this.oopNextPage();

    if (p > 0) {
        requestArg.p = p;
    }

    request.searchBook(requestArg, res => {
        bookService.processSearchResult(res.data);

        this.oopBooks(res.data);
        this.oopNextPage(res.next);
        this.oopLastSearch(q);

        let data = {
                resultInfo: app.lang.catalog_result.replace('{0}', res.total),
                books: this.oopBooks(),
                hasMore: res.next !== '0',
            };

        if (this.data.showHead) {
            data.showHead = false;
        }

        this.setData(data, () => {
            this.scrollPage();
        });
    });
};

pageParams.scrollPage = function () {
    // 基础库 1.4.0 开始支持
    if (! wx.pageScrollTo) {
        return;
    }

    let pageHeight = this.oopPageHeight();

    // 第一次检索 不需要滚动
    if (pageHeight === 0) {
        this.processPageHeight();
        return;
    }

    // 下一页加载完后 页面自动向下滚动一部分
    wx.pageScrollTo({
        scrollTop: pageHeight - 200,
    });

    this.processPageHeight();
};

pageParams.processPageHeight = function () {
    // 基础库 1.4.0 开始支持
    if (! wx.createSelectorQuery) {
        return;
    }

    wx.createSelectorQuery().select('.result').boundingClientRect().exec(res => {
        this.oopPageHeight(res[0].height);
    });
};

pageParams.oopPageHeight = function (value) {
    if (value === undefined) {
        return this.tmp.pageHeight || 0;
    }
    this.tmp.pageHeight = value;
};

pageParams.oopCurrSearch = function (value) {
    if (value === undefined) {
        return (this.tmp.currSearch || '').trim();
    }
    this.tmp.currSearch = value;
};

pageParams.oopLastSearch = function (value) {
    if (value === undefined) {
        return this.tmp.lastSearch || '';
    }
    this.tmp.lastSearch = value;
};

pageParams.oopBooks = function (value, reset = false) {
    if (value === undefined) {
        return this.tmp.books || [];
    }
    this.tmp.books = reset ? [...value] : [...(this.tmp.books || []), ...value];
};

pageParams.oopNextPage = function (value) {
    if (value === undefined) {
        return this.tmp.nextPage || 0;
    }
    this.tmp.nextPage = value;
};

Page(pageParams);
