const express = require('express');
const config = require('./config');
const indexRoute = require('./routes/index');
const error404 = require('./middleware/er404');

const app = express();

app.set('views', 'src/views');
app.set('view engine', 'ejs');

app.use(express.json());

app.use(indexRoute);

app.use(error404);

const port = config.PORT || 8989
app.listen(port);
