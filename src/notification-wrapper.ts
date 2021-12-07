import { Server } from 'socket.io'
import { createServer } from 'http'
import { app } from './app'

class NotificationWrapper {
  private _io: any

  get io() {
    if (!this._io) {
      throw new Error('Cannot access Notification client before connecting')
    }

    return this._io
  }

  listen() {
    return new Promise<void>((resolve, reject) => {
      const httpServer = createServer(app)
      this._io = new Server(httpServer, {
        cors: {
          origin: ["http://localhost:3050"]
        }
      })

      this.io.on('connect', (socket: any) => {
        console.log(socket, 'Successfully connected')
      })

      resolve()
    })
  }
}

export const notificationWrapper = new NotificationWrapper()