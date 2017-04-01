/*
 * 参考资料 https://github.com/dannnney/weapp-event
 */

var events = {};

function on(name, callback, self) {
    var tuple = [self, callback];
    var callbacks = events[name];
    if (Array.isArray(callbacks)) {
        callbacks.push(tuple);
    }
    else {
        events[name] = [tuple];
    }
}

function remove(name, self) {
    var callbacks = events[name];
    if (Array.isArray(callbacks)) {
        events[name] = callbacks.filter((tuple) => {
            return tuple[0] != self;
        })
    }
}

function emit(name, data) {
    var callbacks = events[name];
    if (Array.isArray(callbacks)) {
        callbacks.map((tuple) => {
            var self = tuple[0];
            var callback = tuple[1];
            callback.call(self, data);
        })
    }
}

exports.on = on;
exports.remove = remove;
exports.emit = emit;



/*
 * 下面这个没用到
 * 参考资料 https://aotu.io/notes/2017/01/19/wxapp-event/
 * 看起来比较好 但是运行不了 知识不够 debug 失败
 */
class EventTest {
    on (event, fn, ctx) {
        if (typeof fn != "function") {
            console.error('fn must be a function')
            return
        }
        this._stores = this._stores || {}
        
        ;(this._stores[event] = this._stores[event] || []).push({cb: fn, ctx: ctx})
    }
    emit (event) {
        this._stores = this._stores || {}
        var store = this._stores[event], args
        if (store) {
            store = store.slice(0)
            args = [].slice.call(arguments, 1)
            for (var i = 0, len = store.length; i < len; i++) {
                store[i].cb.apply(store[i].ctx, args)
            }
        }
    }
    off (event, fn) {
        this._stores = this._stores || {}
        // all
        if (!arguments.length) {
            this._stores = {}
            return
        }
        // specific event
        var store = this._stores[event]
        if (!store) return
        // remove all handlers
        if (arguments.length === 1) {
            delete this._stores[event]
            return 
        }
        // remove specific handler
        var cb
        for (var i = 0, len = store.length; i < len; i++) {
            cb = store[i].cb
            if (cb === fn) {
                store.splice(i, 1)
                break
            }
        }
        return
    }
}