const { v4: uuid } = require('uuid');

class Book {
  id = uuid();

  constructor(obj) {
    const {
      title = '',
      description = '',
      authors = '',
      favorite = '',
      fileCover = '',
      fileName = '',
      fileBook = '',
    } = obj;

    this.title = title;
    this.description = description;
    this.authors = authors;
    this.favorite = favorite;
    this.fileCover = fileCover;
    this.fileName = fileName;
    this.fileBook = fileBook;
  }
}

module.exports = Book;
