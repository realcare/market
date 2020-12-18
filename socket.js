const SocketIO = require('socket.io');
const axios = require('axios');

module.exports = (server, app, sessionMiddleware) => {
  const io = SocketIO(server, { path: '/socket.io' });
  app.set('io', io);

  const chat = io.of('/chatting');

  io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  chat.on('connection', (socket) => {
    console.log('chat 네임스페이스에 접속');

    const req = socket.request;

    const {
      headers: { referer },
    } = req;

    const roomId = referer
      .split('/')
      [referer.split('/').length - 1].replace(/\?.+/, '');

    socket.join(roomId);
    3;

    socket.on('disconnect', () => {
      console.log('chat 네임스페이스 접속 해제');
      socket.leave(roomId);

      const currentRoom = socket.adapter.rooms[roomId];
      const userCount = currentRoom ? currentRoom.length : 0;

      if (userCount === 0) {
        axios
          .delete(`http://localhost:8080/chatting/${roomId}`)
          .then(() => {
            console.log('방 제거 요청 성공');
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });
  });
};
