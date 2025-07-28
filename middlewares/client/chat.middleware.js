const mongoose = require('mongoose');
const RoomChat = require("../../models/rooms-chat.model");

module.exports.isAccess = async (req, res, next) => {
  const roomChatId = req.params.roomChatId;
  const userId = res.locals.user.id;

  // Kiểm tra xem roomChatId có phải là ObjectId hợp lệ không
  if (!mongoose.Types.ObjectId.isValid(roomChatId)) {
    return res.redirect("/"); // Hoặc trả về lỗi 400
  }

  try {
    const existUserInRoomChat = await RoomChat.findOne({
      _id: roomChatId,
      "users.user_id": userId,
      deleted: false,
    });

    if (existUserInRoomChat) {
      next();
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.error("Error in isAccess middleware:", error);
    res.redirect("/");
  }
};