const { Server } = require('socket.io')
const { createServer } = require('node:http')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.APP_IP || 'localhost'
const port = process.env.APP_PORT || 3000

const app = next({ dev, hostname, port })
const handler = app.getRequestHandler()

app.prepare().then(() => {
   const httpServer = createServer(handler)

   const io = new Server(httpServer)

   io.on('connection', (socket: any) => {
      socket.on('qrGet', () => {
         const uuid = crypto.randomUUID()
         socket.join(uuid)
         socket.emit('qrGet', uuid)
      })

      socket.on('qrPost', (qrPost: any) => {
         socket.to(qrPost.uuid).emit('qrPost', qrPost.userID)
         socket.to(qrPost.uuid).socketsLeave(qrPost.uuid)
         socket.to(qrPost.uuid).disconnectSockets()
         socket.disconnect()
      })
   })

   httpServer
      .once('error', (err: any) => {
         console.error(err)
         process.exit(1)
      })
      .listen(port, () => {

         console.log(`> Запутстилось на http://${hostname}:${port}`)
      })
})
