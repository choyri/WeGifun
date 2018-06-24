// 跨页面通信 # 参考资料 http://t.cn/RS9Uq58 http://t.cn/RjZ8U10

class Event {
  static stores = {}

  static on (event, fn, ctx) {
    (this.stores[event] = this.stores[event] || []).push({ cb: fn, ctx: ctx })
  }

  static emit (event, ...args) {
    if (!this.stores[event]) {
      return
    }

    this.stores[event].map(store => {
      store.cb.apply(store.ctx, args)
    })
  }

  static off (ctx) {
    for (let event in this.stores) {
      this.stores[event] = this.stores[event].filter(store => store.ctx !== ctx)
    }
  }
}

export default Event
