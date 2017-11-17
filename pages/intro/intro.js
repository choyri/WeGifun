let app = getApp(),
    pageParams = {
        data: {
            text_blockquote: app.lang.intro_blockquote,
            text_btnTitle: app.lang.btn_title,
            text_content: [
                {
                    title: app.lang.intro_noun,
                    content: [
                        {
                            title: app.lang.intro_noun_service,
                            content: app.lang.intro_noun_service_content,
                        },
                        {
                            title: app.lang.intro_noun_account,
                            content: app.lang.intro_noun_account_content,
                        },
                    ],
                },
                {
                    title: app.lang.intro_guide,
                    content: app.lang.intro_guide_content,
                },
            ],
        },
    };

pageParams.onReady = function () {
    wx.setNavigationBarTitle({
        title: app.lang.intro_title
    });
};

pageParams.bindSubmit = function () {
    wx.navigateBack();
};

Page(pageParams);
