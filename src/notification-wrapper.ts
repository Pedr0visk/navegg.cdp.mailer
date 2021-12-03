import { Server } from 'socket.io'

class NotificationWrapper {
  private _io: Server
  private PORT: number = 3333

  get io() {
    if (!this._io) {
      throw new Error('Cannot access Notification client before connecting')
    }

    return this._io
  }

  listen() {
    return new Promise<void>((resolve, reject) => {
      this._io = new Server()

      this.io.on('connect', (socket: any) => {
        console.log(socket, 'Successfully connected')
      })

      this.io.listen(this.PORT)
      resolve()
    })
  }
}

export const notificationWrapper = new NotificationWrapper()