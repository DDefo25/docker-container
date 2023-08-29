const { v4: uuid } = require('uuid');
const Book = require('./Book');

class Library {
  constructor() {
    this.id = uuid();
    this.buffer = [];
  }

  add(data) {
    const newBook = new Book(data);
    this.buffer.push(newBook);

    return newBook;
  }

  get(id) {
    const book = this.buffer.find((b) => b.id === id);
    if (book === undefined) throw new Error('Книга не найдена в библиотеке');
    return book;
  }

  getAll() {
    return this.buffer;
  }

  update(id, params) {
    const book = this.buffer.find((b) => b.id === id);
    if (book === undefined) throw new Error('Книга не найдена в библиотеке');

    for (const [key, value] of Object.entries(params)) {
      if (book[key] === undefined) {
        throw new Error('Передано некорректное название параметра книги');
      }

      book[key] = value;
    }

    return book;
  }

  remove(id) {
    const idx = this.buffer.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error('Книга не найдена в библиотеке');
    this.buffer.splice(idx, 1);
  }
}

module.exports = Library;
