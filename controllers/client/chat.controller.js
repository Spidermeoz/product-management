// [GET] /chat
module.exports.index = (req, res) => {
  // SocketIO
  _io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    // socket.on("disconnect", () => {
    //   console.log("user disconnected");
    // });
  });
  // End SocketIO
  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
  });
};