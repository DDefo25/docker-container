const express = require('express');
const config = require('./config');
const indexRouter = require('./routes/index');
const error404 = require('./middleware/er404');

const app = express();

app.set('view engine', 'ejs');

app.use(express.json());

app.use(indexRouter);

app.use(error404);

app.listen(config.PORT);
