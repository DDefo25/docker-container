const express = require('express');
const { route } = require('./api');
const apiRouter = require('./api');

const router = express.Router();

router.use(apiRouter);

router.get('/', (_, res) => {
    res.render('index', {
        title: 'Главная'
    })
})

module.exports = router;