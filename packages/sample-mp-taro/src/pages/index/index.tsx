import { Client } from '@stomp/stompjs'
import { Button } from '@tarojs/components'
import Ws from 'mp-websocket-polyfill/src/index'
import { useRef } from 'react'

export default function StompPage() {
  const clientRef = useRef<Client>()

  const connect = () => {
    const client = new Client({
      heartbeatOutgoing: 1000,

      onConnect() {
        wx.showToast({ title: '连接成功', icon: 'none' })

        // 接收订阅特定 path 的消息
        client.subscribe('/topic/greetings', message => {
          console.log(`★ 收到消息:\n${message.body}`)
        })

        // 发送特定 path 的消息
        client.publish({
          destination: '/app/hello',
          body: JSON.stringify({ name: 'Test' }),
        })
      },

      onDisconnect() {
        wx.showToast({ title: '已断开', icon: 'none' })
      },

      // 开启调试
      debug: console.log,

      webSocketFactory() {
        // 注意 ↓ 此处使用 mp-websocket-polyfill
        return new Ws({
          url: 'ws://localhost:8080/gs-guide-websocket',
          timeout: 30000,
          protocols: ['v12.stomp', 'v11.stomp', 'v10.stomp'], // ← 这是 stomp 的协议，必须写
          header: {
            Origin: 'http://localhost:8080', // ← 有些服务端必须提供正确的 Origin，可能必须 http(s) 开头，不是 ws 开头
          },
        })
      },
    })

    client.activate()

    clientRef.current = client
  }

  const disconnect = () => {
    clientRef.current?.deactivate()
  }

  return (
    <view>
      <Button onClick={connect}>点我连接</Button>
      <Button onClick={disconnect}>点我关闭</Button>
    </view>
  )
}
