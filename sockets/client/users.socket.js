const User = require("../../models/user.model");

module.exports = (res) => {
  // SocketIO
  _io.once("connection", (socket) => {
    // Chức năng gửi yêu cầu kết bạn
    socket.on("CLIENT_ADD_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;
      // console.log(myUserId); A
      // console.log(userId);   B

      // Thêm id của A và acceptFriends của B
      existIdAinB = await User.findOne({
        _id: userId,
        acceptFriends: myUserId,
      });
      if (!existIdAinB) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $push: { acceptFriends: myUserId },
          }
        );
      }

      // Thêm id của B vào requestFriends của A
      existIdBinA = await User.findOne({
        _id: myUserId,
        requestFriends: userId,
      });
      if (!existIdBinA) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $push: { requestFriends: userId },
          }
        );
      }

      // Lấy ra độ dài acceptFriends của B và trả về cho B
      const infoUser = await User.findOne({
        _id: userId,
      });
      const lengthAcceptFriends = infoUser.acceptFriends.length;

      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        user_id: userId,
        lengthAcceptFriends: lengthAcceptFriends
      })
    });

    // Chức năng hủy gửi yêu cầu kết bạn
    socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;
      // console.log(myUserId); A
      // console.log(userId);   B

      // Xóa id của A trong acceptFriends của B
      existIdAinB = await User.findOne({
        _id: userId,
        acceptFriends: myUserId,
      });
      if (existIdAinB) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $pull: { acceptFriends: myUserId },
          }
        );
      }

      // Xóa id của B trong requestFriends của A
      existIdBinA = await User.findOne({
        _id: myUserId,
        requestFriends: userId,
      });
      if (existIdBinA) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $pull: { requestFriends: userId },
          }
        );
      }
    });

    // Chức năng xóa lời mời kết bạn
    socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;
      // console.log(myUserId); B
      // console.log(userId);   A

      // Xóa id của A trong acceptFriends của B
      existIdAinB = await User.findOne({
        _id: myUserId,
        acceptFriends: userId,
      });
      if (existIdAinB) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $pull: { acceptFriends: userId },
          }
        );
      }

      // Xóa id của B trong requestFriends của A
      existIdBinA = await User.findOne({
        _id: userId,
        requestFriends: myUserId,
      });
      if (existIdBinA) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $pull: { requestFriends: myUserId },
          }
        );
      }
    });

    // Chức năng chấp nhận lời mời kết bạn
    socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;
      // console.log(myUserId); B
      // console.log(userId);   A

      // Xóa id của A trong acceptFriends của B và Thêm {user_id, room_chat_id} của A vào friendList của B
      existIdAinB = await User.findOne({
        _id: myUserId,
        acceptFriends: userId,
      });
      if (existIdAinB) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $push: {
              friendList: {
                user_id: userId,
                room_chat_id: "",
              },
            },
            $pull: { acceptFriends: userId },
          }
        );
      }

      // Xóa id của B trong requestFriends của A và Thêm {user_id, room_chat_id} của B vào friendList của A
      existIdBinA = await User.findOne({
        _id: userId,
        requestFriends: myUserId,
      });
      if (existIdBinA) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $push: {
              friendList: {
                user_id: myUserId,
                room_chat_id: "",
              },
            },
            $pull: { requestFriends: myUserId },
          }
        );
      }
    });
  });
  // End SocketIO
};
