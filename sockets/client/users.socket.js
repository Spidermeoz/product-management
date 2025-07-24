const User = require("../../models/user.model");

module.exports = (res) => {
  // SocketIO
  _io.once("connection", (socket) => {
    // Chức năng gửi yêu cầu kết bạn
    socket.on("CLIENT_ADD_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

    //   console.log(myUserId);
    //   console.log(userId);
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
      // End Thêm id của A và acceptFriends của B

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
      // End Thêm id của B vào requestFriends của A
    });
    // End Chức năng gửi yêu cầu kết bạn

    // Chức năng hủy gửi yêu cầu kết bạn
    socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

    //   console.log(myUserId);
    //   console.log(userId);
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
      // End Xóa id của A trong acceptFriends của B

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
      // End Xóa id của B trong requestFriends của A
    });
    // End Chức năng hủy gửi yêu cầu kết bạn
  });
  // End SocketIO
};
