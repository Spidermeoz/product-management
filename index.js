const express = require('express');
const database = require('./config/database');

const systemConfig = require('./config/system');

require('dotenv').config();

const route = require('./routes/client/index.route');
const routeAdmin = require('./routes/admin/index.route');

const app = express();
const port = process.env.PORT;

database.connect();

app.set('views', './views');
app.set('view engine', 'pug');

// App local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static('public'));

//routes
routeAdmin(app);
route(app);

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});