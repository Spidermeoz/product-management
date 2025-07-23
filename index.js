const express = require("express");
var path = require("path");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const moment = require("moment");

const database = require("./config/database");

const systemConfig = require("./config/system");

require("dotenv").config();

const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");

const app = express();
const port = process.env.PORT;

database.connect();

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false }));

// Flash
app.use(cookieParser("keyboard cat"));
app.use(
  session({
    cookie: { maxAge: 60000 },
    secret: "your-secret-key", // Bắt buộc phải có
    resave: false, // Chọn false để tránh lưu lại session không thay đổi
    saveUninitialized: false, // Chọn false để tránh tạo session cho những request không cần
    cookie: { secure: false }, // Tuỳ chọn (đặt true nếu dùng HTTPS)
  })
);
app.use(flash());
// End of flash

// TinyMCE
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);
//End TinyMCE

// App local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

app.use(express.static(`${__dirname}/public`));

//routes
routeAdmin(app);
route(app);

app.get('/*\w', (req, res) => {
  res.render("client/pages/errors/404", {
    pageTitle: "404 Not Found",
  });
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
