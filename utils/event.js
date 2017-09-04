// 跨页面通信 # 参考资料 http://t.cn/RS9Uq58

class Event {
    on(event, fn, ctx) {
        this._stores = this._stores || {};

        (this._stores[event] = this._stores[event] || []).push({
            cb: fn,
            ctx: ctx
        });
    }

    emit(event) {
        this._stores = this._stores || {};

        let store = this._stores[event],
            args;

        if (store) {
            store = store.slice(0);
            args = [].slice.call(arguments, 1);

            store.map((tmp) => {
                tmp.cb.apply(tmp.ctx, args);
            });
        }
    }

    off(ctx) {
        this._stores = this._stores || {};

        if (! arguments.length) {
            this._stores = {};
            return;
        }

        for (let event in this._stores) {
            let store = this._stores[event];

            for (let i = 0, len = store.length; i < len; i++) {
                if (store[i].ctx === ctx) {
                    store.splice(i, 1)
                }
            }
        }
    }
}

module.exports = Event;
