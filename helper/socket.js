const { Server } = require("socket.io");

module.exports.init = (server) => {
    const io = new Server(server, { cors: { 'origin': '*' } });
    io.on("connection", (socket) => {
        socket.on('join-conversation', (data) => {
            socket.join(data);
        });

        socket.on('sendMessage', function (data) {
            io.to(data._id).emit("getConversationList", data);
        });

        socket.on('leave', function (data) {
            socket.leave(data);
        });

        socket.on('acceptInterview', function (data) {
            socket.broadcast.emit("accepted", data);
        });
    });
}