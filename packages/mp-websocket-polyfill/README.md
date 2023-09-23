# `mp-websocket-polyfill`

适用于微信小程序的垫片，使小程序的 [`SocketTask`](https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.connectSocket.html) 兼容浏览器端的 [`WebSocket`](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)，这样便可以使用 [`Stomp.js`](https://github.com/stomp-js/stompjs) 等库。

# 安装

```bash
yarn add mp-websocket-polyfill
```

# 使用方式

## 直接使用

原来：

```typescript
const socketTask = wx.connectSocket({
  url: 'localhost:8080/ws',
  // ...其他参数
})
```

替换为：

```typescript
import Ws from 'mp-websocket-polyfill'

const webSocket = new Ws({
  url: 'localhost:8080/ws',
  // ...其他参数，和 wx.connectSocket 保持一致
})
```

然后这个 `webSocket` 对象便可以在只支持浏览器端 `WebSocket` 的地方使用了。

## 配合 `Stomp.js` 使用

```typescript
import { Client } from '@stomp/stompjs'
import Ws from 'mp-websocket-polyfill'

const client = new Client({
  // ↓ 请使用 webSocketFactory 修改默认的 websocket 构造器
  webSocketFactory() {
    return new Ws({
      url: 'ws://localhost:8080/gs-guide-websocket',
      protocols: ['v12.stomp', 'v11.stomp', 'v10.stomp'], // ← 这是 stomp 的协议，必须写
    })
  },
})

client.activate()
```

# 注意事项

注意事项：

- 使用垫片构造的实例，原先小程序自带的 API 例如 `onOpen`、`onClose` 均被屏蔽无法使用，但是可以通过新实例 `.socketTask` 属性获取小程序原生的 `SocketTask` 对象；
- 如果使用 Stomp，建议参考上面的示例，尤其是 `protocols` 和 `header` 字段；
- 如有 iOS 使用 Stomp 断连的问题，可参考社区案例：[https://developers.weixin.qq.com/community/develop/article/doc/00028457db8230ae22ebb525e56c13](https://developers.weixin.qq.com/community/develop/article/doc/00028457db8230ae22ebb525e56c13)。

# API

- `new Ws()`（即 `constructor()`）：和微信小程序的 `wx.connectSocket()` 参数保持一致；
- `ws.socketTask`：通过实例的这个属性，可以获取原生的小程序 `socketTask` 对象。
