const app = require("./app")

const { Server } = require('socket.io')
const http = require('http')
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

const jwt = require('jsonwebtoken')

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.query.token
    const payload = await jwt.verify(token, process.env.TOKEN_SECRET)
    socket.id = payload._id
    next()
  } catch (error) { }
})

io.on('connection', (socket) => {
  console.log('user id: ', socket);

  socket.on('join_room', (data) => {
    socket.join(data)
  })

  socket.on('send_message', data => {
    socket.to(data.room).emit('receive_message', data)
  })
})

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`)
})
