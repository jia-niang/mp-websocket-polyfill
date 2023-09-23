# `mp-websocket-polyfill`

适用于微信小程序的垫片，使小程序的 [`SocketTask`](https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.connectSocket.html) 兼容浏览器端的 [`WebSocket`](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)，这样便可以使用 [`Stomp.js`](https://github.com/stomp-js/stompjs) 等库。

# 安装

```bash
yarn add mp-websocket-polyfill

# 小程序真机调试，可能会因找不到 TextEncoder、TextDecoder 而报错
# 所以，推荐安装垫片：
yarn add fastestsmallesttextencoderdecoder
```

# 使用方式

## 解决真机 `TextEncoder`、`TextDecoder` 找不到问题

安装依赖：

```bash
yarn add fastestsmallesttextencoderdecoder
```

然后在入口处：

```typescript
import 'fastestsmallesttextencoderdecoder'
```

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
      protocols: ['v12.stomp', 'v11.stomp', 'v10.stomp'], // ← 这是 stomp 协议的默认写法，可供参考
    })
  },
})

client.activate()
```

# 注意事项

注意事项：

- 使用垫片构造的实例，原先小程序自带的 API 例如 `onOpen`、`onClose` 均被屏蔽无法使用，但是可以通过新实例 `.socketTask` 属性获取小程序原生的 `SocketTask` 对象；
- 如果使用 Stomp，建议参考上面的示例，有时 `protocols` 也要配置正确。

# API

- `new Ws(options)`：兼容微信小程序的 `wx.connectSocket()` 的参数，提供额外的配置字段：
  - `fixIOSWechat0x00Issue`：默认为 `true`（`boolean` 类型），是否修复 iOS 微信接收到 Stomp 消息时可能因遗漏末尾 0x00 字符而导致解析失败的问题；
- `ws.socketTask`：通过实例的这个属性，可以获取原生的小程序 `socketTask` 对象。
