const express = require('express')
const path = require('path')

const app = express()
const http = require('http').createServer(app)

app.use(express.static(path.join(__dirname, 'public')))

const io = require('socket.io')(http)
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require('./utils/users');
io.on('connection', socket => {
    // console.log('connected Ready')

    // socket.on('sendMessage',msg=>{
    //     socket.broadcast.emit('sendtoAll',msg);
    // })

    // socket.on('disconnect',()=>{
    //     console.log('user disconnected')
    // })
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);
        console.log(user)

        socket.on('sendMessage', msg => {
            socket.broadcast.to(user.room).emit('sendtoAll', msg);
            console.log('hello')
            console.log(msg)
        })
        
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
          });
    });
      // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
 
});



const PORT = process.env.PORT || 3003
http.listen(PORT, () => {
    console.log("Server is running on Port", PORT)

})