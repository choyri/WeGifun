let app = getApp();

function processSearchResult(data) {
    for (let book of data) {
        app.cache.books = app.cache.books || {};
        app.cache.books[book.marc] = book;

        book.amount = app.lang.catalog_amount.replace('{0}', book.total).replace('{1}', book.available);
    }
}

function processCollection(data) {
    let stateValue = app.lang.catalog_info_collection_state;

    for (let item of data) {
        if (item.state === 'ok') {
            item.state = stateValue[0];
            item.available = true;
        } else {
            item.state = stateValue[1].replace('{0}', item.state);
        }
    }
}

module.exports = {
    processSearchResult,
    processCollection,
};
