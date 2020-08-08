const sio = require('socket.io')
const store = require('../store')

const io = sio()

// io.use((socket, next) => {
//   socket.user = null
//   next()
// })

io.on('connection', socket => {
  console.log('A user connected')
  console.log(store.listUsers.length)

  socket.on('join room', (data) => {
    const index = store.listUsers.findIndex(user => user._id === data.user._id)
    if (index === -1) {
      store.listUsers.push(data.user)
      socket.id = data.user._id
      socket.broadcast.emit('an user joined room', { user: data.user })
    }
  })

  socket.on('get list users', data => {
    socket.emit('list users', { listUsers: store.listUsers })
  })

  // socket.on('logout', (data) => {
  //   if (socket.user) {
  //     socket.disconnect()
  //   }
  // })

  socket.on('disconnect', async () => {
    console.log('An user disconnected')
    
    if (socket.id) {
      const index = store.listUsers.findIndex(user => user._id === socket.id)
      if (index > -1) {
        socket.broadcast.emit('an user leaved room', { user: store.listUsers[index] })
        store.listUsers.splice(index, 1)
      }
    }
  })
})

module.exports = io
