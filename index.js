const express = require('express');
const methodOverride = require('method-override');

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

app.use(methodOverride('_method'));

// App local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static('public'));

//routes
routeAdmin(app);
route(app);

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});