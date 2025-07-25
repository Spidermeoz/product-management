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

  const requestFriends = myUser.requestFriends
  const acceptFriends = myUser.acceptFriends
  const friendList = myUser.friendList.map(item => item.user_id)

  const users = await User.find({
    $and: [
      {_id: { $ne: userId }},
      {_id: { $nin: requestFriends }},
      {_id: { $nin: acceptFriends }},
      {_id: { $nin: friendList }}
    ],
    status: "active",
    deleted: false,
  }).select("id avatar fullName");

  res.render("client/pages/users/not-friend.pug", {
    pageTitle: "Danh sách người dùng",
    users: users,
  });
};

// [GET] /user/request
module.exports.request = async (req, res) => {
  // SocketIO
    usersSocket(res)
    // End SocketIO
  const userId = res.locals.user.id;

  const myUser = await User.findOne({
    _id: userId
  })

  const requestFriends = myUser.requestFriends

  const users = await User.find({
    _id: { $in: requestFriends },
    status: "active",
    deleted: false,
  }).select("id avatar fullName");

  res.render("client/pages/users/request.pug", {
    pageTitle: "Lời mời đã gửi",
    users: users
  });
};

// [GET] /user/accept
module.exports.accept = async (req, res) => {
  // SocketIO
    usersSocket(res)
    // End SocketIO
  const userId = res.locals.user.id;

  const myUser = await User.findOne({
    _id: userId
  })
  
  const acceptFriends = myUser.acceptFriends

  const users = await User.find({
    _id: { $in: acceptFriends },
    status: "active",
    deleted: false,
  }).select("id avatar fullName");

  res.render("client/pages/users/accept.pug", {
    pageTitle: "Lời mời đã nhận",
    users: users
  });
};

// [GET] /user/friends
module.exports.friends = async (req, res) => {
  // SocketIO
    usersSocket(res)
    // End SocketIO
  const userId = res.locals.user.id;

  const myUser = await User.findOne({
    _id: userId
  })
  
  const friendList = myUser.friendList
  const friendListId = friendList.map( item => item.user_id)

  const users = await User.find({
    _id: { $in: friendListId },
    status: "active",
    deleted: false,
  }).select("id avatar fullName statusOnline");

  res.render("client/pages/users/friends.pug", {
    pageTitle: "Danh sách bạn bè",
    users: users
  });
};
