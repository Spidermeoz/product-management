const User = require("../../models/user.model");
const usersSocket = require("../../sockets/client/users.socket")

// [GET] /user/not-friend
module.exports.notFriend = async (req, res) => {
  // SocketIO
    usersSocket(res)
    // End SocketIO
  const userId = res.locals.user.id;

  const myUser = await User.findOne({
    _id: userId
  })
  console.log(myUser)

  const requestFriends = myUser.requestFriends
  const acceptFriends = myUser.acceptFriends

  console.log(requestFriends, acceptFriends)

  const users = await User.find({
    $and: [
      {_id: { $ne: userId }},
      {_id: { $nin: requestFriends }},
      {_id: { $nin: acceptFriends }}
    ],
    status: "active",
    deleted: false,
  }).select("id avatar fullName");
  console.log(users)

  res.render("client/pages/users/not-friend.pug", {
    pageTitle: "Danh sách người dùng",
    users: users,
  });
};
