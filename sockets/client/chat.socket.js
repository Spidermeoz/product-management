const Chat = require("../../models/chat.model");

const uploadToCloudinary = require("../../helpers/uploadToCloudinary");

module.exports = (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;
  const roomChatId = req.params.roomChatId;
  // SocketIO
  _io.once("connection", (socket) => {
    socket.join(roomChatId);
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      console.log("Nhận dữ liệu từ client:", {
        content: data.content,
        imageCount: data.images ? data.images.length : 0,
      });

      let images = [];

      console.log(data.images.length);
      for (const imageBuffer of data.images) {
        const link = await uploadToCloudinary(imageBuffer);
        console.log(imageBuffer);
        images.push(link);
      }

      console.log(images);
      // Lưu vào database
      const chat = new Chat({
        user_id: userId,
        room_chat_id: roomChatId,
        content: data.content,
        images: images,
      });
      await chat.save();

      // Trả data về cho client
      _io.to(roomChatId).emit("SERVER_RETURN_MESSAGE", {
        user_id: userId,
        fullName: fullName,
        content: data.content,
        images: images,
      });
    });

    // Typing
    socket.on("CLIENT_SEND_TYPING", async (type) => {
      socket.broadcast.to(roomChatId).emit("SERVER_RETURN_TYPING", {
        user_id: userId,
        fullName: fullName,
        type: type,
      });
    });
    // End typing
  });
  // End SocketIO
};
