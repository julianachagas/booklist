class Book {
  constructor(title, author) {
    this.title = title
    this.author = author
  }
}

class Store {
  static getBooks() {
    let books
    if (!localStorage.getItem('books')) {
      books = []
    } else {
      books = JSON.parse(localStorage.getItem('books'))
    }
    return books
  }

  static setLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  static addBookToStorage(bookObject) {
    const storedBooks = Store.getBooks()
    storedBooks.push(bookObject)
    Store.setLocalStorage('books', storedBooks)
  }

  static removeBookFromStorage(bookTitle) {
    const storedBooks = Store.getBooks()
    storedBooks.forEach((item, index) => {
      if (item.title === bookTitle) {
        storedBooks.splice(index, 1)
      }
    })
    Store.setLocalStorage('books', storedBooks)
  }
}

class UI {
  static createBookListItem(bookObject) {
    const bookList = document.getElementById('book-list')
    const listItem = document.createElement('li')
    const bookInfoContainer = document.createElement('div')
    bookInfoContainer.classList.add('book-info', 'flex-column')
    const bookName = document.createElement('span')
    bookName.classList.add('book-name')
    bookName.textContent = bookObject.title
    const bookAuthor = document.createElement('span')
    bookAuthor.classList.add('book-author')
    bookAuthor.textContent = bookObject.author
    bookInfoContainer.append(bookName, bookAuthor)
    const deleteBtn = document.createElement('button')
    deleteBtn.classList.add('btn', 'delete')
    deleteBtn.textContent = 'delete'
    listItem.append(bookInfoContainer, deleteBtn)
    bookList.appendChild(listItem)
  }

  static addBook() {
    const title = document.querySelector('#add-book-title').value
    const author = document.querySelector('#add-book-author').value
    const inputValidation = document.querySelector('#input-validation')
    const successMessage = document.querySelector('#success-message')
    if (title !== '' && author !== '') {
      //create book object, instatiate book
      const newBook = new Book(title, author)
      //Add book to UI
      UI.createBookListItem(newBook)
      //Add book to store
      Store.addBookToStorage(newBook)
      UI.clearFields()
      UI.notEmptyBookListState()
      UI.focusField()
      UI.showAlert(successMessage)
    } else {
      UI.showAlert(inputValidation)
    }
  }

  static clearFields() {
    document.querySelector('#add-book-title').value = ''
    document.querySelector('#add-book-author').value = ''
  }

  static showAlert(element) {
    element.classList.add('show')
    setTimeout(() => {
      element.classList.remove('show')
    }, 3000)
  }

  static focusField() {
    document.querySelector('#add-book-title').focus()
  }

  static notEmptyBookListState() {
    document.querySelector('#empty-list-instruction').classList.remove('show')
    document.querySelector('.hide-books-wrapper').classList.add('show')
  }

  static emptyBookListState() {
    document.querySelector('#empty-list-instruction').classList.add('show')
    document.querySelector('.hide-books-wrapper').classList.remove('show')
  }

  static deleteBook(e) {
    const bookList = document.getElementById('book-list')
    if (e.target.classList.contains('delete')) {
      const listItem = e.target.parentElement
      const bookTitle = listItem.querySelector('.book-name').textContent
      listItem.remove()
      Store.removeBookFromStorage(bookTitle)
      if (bookList.children.length === 0) {
        UI.emptyBookListState()
      }
    }
  }

  static displayBooks() {
    const storedBooks = Store.getBooks()
    if (storedBooks.length !== 0) {
      //display the books stored
      storedBooks.forEach(book => UI.createBookListItem(book))
      //remove initial instructions and show checkbox to hide the books
      UI.notEmptyBookListState()
    }
  }

  static filterBooks(e) {
    const term = e.target.value.toLowerCase()
    const books = document.querySelectorAll('#book-list li')
    books.forEach(book => {
      const bookTitle = book
        .querySelector('.book-name')
        .textContent.toLowerCase()
      book.classList.toggle('hide', !bookTitle.includes(term))
    })
  }

  static showPanel(e) {
    const panels = document.querySelectorAll('.panel')
    const tabsItems = document.querySelectorAll('.tabs li')
    if (e.target.tagName == 'LI') {
      tabsItems.forEach(item => {
        item.classList.toggle('active', e.target === item)
      })
      const targetPanel = document.querySelector(e.target.dataset.target)
      panels.forEach(panel => {
        panel.classList.toggle('active', panel === targetPanel)
      })
    }
  }

  static hidePanel() {
    const panels = document.querySelectorAll('.panel')
    const tabsItems = document.querySelectorAll('.tabs li')
    panels.forEach(panel => {
      panel.classList.remove('active')
    })
    tabsItems.forEach(item => {
      item.classList.remove('active')
    })
  }
}

//display books when page loads
document.addEventListener('DOMContentLoaded', UI.displayBooks)

//add a book
const addForm = document.forms['add-book']
addForm.addEventListener('submit', function (e) {
  e.preventDefault()
  UI.addBook()
})

addForm.addEventListener('click', UI.hidePanel)

//delete book
const bookList = document.getElementById('book-list')
bookList.addEventListener('click', UI.deleteBook)

//hide books
const hideCheckBox = document.getElementById('hide-books')
hideCheckBox.addEventListener('change', () => {
  bookList.classList.toggle('hide', hideCheckBox.checked)
})

//filter books
const searchBar = document.getElementById('search-book-title')
searchBar.addEventListener('keyup', UI.filterBooks)
searchBar.addEventListener('click', UI.hidePanel)

//tabs
const tabs = document.querySelector('.tabs')
tabs.addEventListener('click', UI.showPanel)
