const express = require('express');
const booksRoute = require('./books');
const userRoute = require('./user');

const router = express.Router();

router.use('/books', booksRoute);
router.use('/user', userRoute);

router.get('/', (_, res) => {
  res.render('index', {
    title: 'Главная',
  });
});

module.exports = router;
