const express = require("express");
const Library = require('../Library');
const file = require('../middleware/file');

const router = express.Router();
const library = new Library();

router.get('/', (req, res) => {
  res.render('books/index', {
    title: 'Список книг',
    library: library.getAll()
  })
});

router.get('/create', (req, res) => {
  res.render("books/create", {
    title: "Книга | добавление",
    book: {},
  });
});

const fileFields = file.fields([
  { name: 'fileBook', maxCount: 1 },
  { name: 'fileCover', maxCount: 1 },
]);

router.post('/create', fileFields, (req, res) => {
  const data = req.body;

  if (req.files) {
    const { fileBook, fileCover } = req.files;
    data.fileBook = fileBook[0].path;
    data.fileName = fileBook[0].filename;
    data.fileCover = fileCover[0].path;
  }

  try {
    library.add(data);
    res.redirect('/api/books');
  } catch (error) {
    res.status(404).render('errors/404', {
      title: error.message,
    });
  }
});

router.post('/', fileFields, (req, res) => {
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

router.get('/:id', (req, res) => {
  const { id } = req.params;
  try {
    res.render('books/view', {
      title: 'Книга',
      book: library.get(id)
    })
  } catch (error) {
    res.status(404).render('errors/404', {
      title: error.message,
    });
  }
});

router.get('/:id/download/:fileType', (req, res) => {
 const { id, fileType } = req.params;
  try {
    const book = library.get(id);
    res.download(`${__dirname}/../${book[fileType]}`, book[fileType], (err) => {
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

router.put('/:id', (req, res) => {
  const data = req.body;
  const { id } = req.params;

  try {
    res.json(library.update(id, data));
  } catch (error) {
    res.status(404).render('errors/404', {
      title: error.message,
    });
  }
});

router.delete('/:id', (req, res) => {
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
