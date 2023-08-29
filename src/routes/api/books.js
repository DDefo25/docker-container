const express = require('express');
const Library = require('../../Library');
const file = require('../../middleware/file');

const router = express.Router();
const library = new Library();

router.get('/', (req, res) => {
  res.json(library.getAll());
});

const fileFields = file.fields([
  { name: 'fileBook', maxCount: 1 },
  { name: 'fileCover', maxCount: 8 },
]);

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
    res.status(404).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  try {
    res.json(library.get(id));
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.put('/:id', (req, res) => {
  const data = req.body;
  const { id } = req.params;

  try {
    res.json(library.update(id, data));
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  try {
    library.remove(id);
    res.json('ок');
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.get('/:id/download', (req, res) => {
  const { id } = req.params;
  try {
    const book = library.get(id);
    res.download(`${__dirname}/../${book.fileBook}`, book.fileName, (err) => {
      if (err) {
        res.status(404).json({ error: err.message });
      }
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
