const express = require('express');
const Library = require('../Library');
const file = require('../middleware/file');
const { error404Custom } = require('./error');

const router = express.Router();
const library = new Library();

router.get('/', (req, res) => {
  res.render('books/index', {
    title: 'Список книг',
    library: library.getAll(),
  });
});

const fileFields = file.fields([
  { name: 'fileBook', maxCount: 1 },
  { name: 'fileCover', maxCount: 1 },
]);

router.route('/create')
  .get((req, res) => {
    res.render('books/create', {
      title: 'Книга | добавление',
      book: {},
    });
  })
  .post(fileFields, (req, res) => {
    const data = req.body;

    if (req.files) {
      const { fileBook, fileCover } = req.files;
      data.fileBook = fileBook[0].path;
      data.fileName = fileBook[0].filename;
      data.fileCover = fileCover[0].path;
    }

    try {
      library.add(data);
      res.redirect('..');
    } catch (error) {
      error404Custom(error, req, res);
    }
  });

router.get('/:id', (req, res) => {
  const { id } = req.params;
  try {
    res.render('books/view', {
      title: 'Книга',
      book: library.get(id),
    });
  } catch (error) {
    error404Custom(error, req, res);
  }
});

router.get('/:id/download/:fileType', (req, res) => {
  const { id, fileType } = req.params;
  try {
    const book = library.get(id);
    res.download(`${__dirname}/../${book[fileType]}`, book[fileType], (err) => {
      if (err) {
        error404Custom(err, req, res);
      }
    });
  } catch (error) {
    error404Custom(error, req, res);
  }
});

router.route('/update/:id')
  .get((req, res) => {
    const { id } = req.params;

    try {
      res.render('books/update', {
        title: 'Книга | редактирование',
        book: library.get(id),
      });
    } catch (error) {
      error404Custom(error, req, res);
    }
  })
  .post(fileFields, (req, res) => {
    const data = req.body;
    const { id } = req.params;

    if (req.files) {
      const { fileBook, fileCover } = req.files;
      data.fileBook = fileBook[0].path;
      data.fileName = fileBook[0].filename;
      data.fileCover = fileCover[0].path;
    }

    try {
      library.update(id, data);
      res.redirect('/api/books/');
    } catch (error) {
      error404Custom(error, req, res);
    }
  });

router.get('/delete/:id', (req, res) => {
  const { id } = req.params;

  try {
    library.remove(id);
    res.redirect('/api/books/');
  } catch (error) {
    error404Custom(error, req, res);
  }
});

module.exports = router;
