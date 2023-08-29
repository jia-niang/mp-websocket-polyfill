export default class Ws {
  public socketTask?: WechatMiniprogram.SocketTask

  public readyState: number = 3
  public url: string

  public onopen?: Function
  public onclose?: Function
  public onerror?: Function
  public onmessage?: Function

  constructor(options: WechatMiniprogram.ConnectSocketOption) {
    this.readyState = 0
    this.socketTask = wx.connectSocket(options)
    this.url = options.url

    this.socketTask.onOpen(() => {
      this.readyState = 1
      this.onopen?.()
    })

    this.socketTask.onClose(() => {
      this.readyState = 3
      this.onclose?.()
    })

    this.socketTask.onError(() => {
      this.readyState = 3
      this.onerror?.()
    })

    this.socketTask.onMessage((message: any) => {
      this.onmessage?.(message)
    })
  }

  send(data: any) {
    this.socketTask?.send({ data })
  }

  close(code?: number, reason?: string) {
    this.socketTask?.close({ code, reason })
  }
}
