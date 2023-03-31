const express = require("express");
const Library = require('../Library');
const file = require('../middleware/file');

const router = express.Router();
const library = new Library();

router.get('/books', (req, res) => {
  res.render('books/index', {
    title: 'Список книг',
    library: library.getAll()
  })
});

router.get('/books/create', (req, res) => {
  res.render("books/create", {
    title: "Книга | добавление",
    book: {},
  });
});

router.get('/books/:id', (req, res) => {
  const { id } = req.params;
  try {
    res.render('books/view', library.get(id))
  } catch (error) {
    res.status(404).render('errors/404', {
      title: error.message,
    });
  }
});

router.get('/books/:id/download', (req, res) => {
 const { id } = req.params;
  try {
    const book = library.get(id);
    res.download(`${__dirname}/../${book.fileBook}`, book.fileName, (err) => {
      if (err) {
        res.status(404).render('errors/404', {
          title: err.message,
        });
      }
    });
  } catch (error) {
    res.status(404).render('errors/404', {
      title: error.message,
    });
  }
});

const fileFields = file.fields([
  { name: 'fileBook', maxCount: 1 },
  { name: 'fileCover', maxCount: 8 },
]);

router.post('/books', fileFields, (req, res) => {
  const data = req.body;

  if (req.files) {
    const { fileBook, fileCover } = req.files;
    data.fileBook = fileBook[0].path;
    data.fileName = fileBook[0].filename;
    data.fileCover = fileCover[0].path;
  }

  try {
    res.status(201).json(library.add(data));
  } catch (error) {
    res.status(404).render('errors/404', {
      title: error.message,
    });
  }
});

router.put('/books/:id', (req, res) => {
  const data = req.body;
  const { id} = req.params;

  try {
    res.json(library.update(id, data));
  } catch (error) {
    res.status(404).render('errors/404', {
      title: error.message,
    });
  }
});

router.delete('/books/:id', (req, res) => {
  const { id } = req.params;

  try { 
    library.remove(id);
    res.json('ок');
  } catch (error) {
    res.status(404).render('errors/404', {
      title: error.message,
    });
  }
});

module.exports = router;
