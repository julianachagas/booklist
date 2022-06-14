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
  constructor() {
    this.bookList = document.getElementById('book-list')
    this.emptyListInstruction = document.querySelector(
      '#empty-list-instruction'
    )
    this.hideBooks = document.querySelector('.hide-books-wrapper')
    this.tabs = document.querySelector('.tabs')
    this.panels = document.querySelectorAll('.panel')
    this.tabsItems = document.querySelectorAll('.tabs li')
    this.inputValidation = document.querySelector('#input-validation')
    this.successMessage = document.querySelector('#success-message')
  }

  createBookListItem(bookObject) {
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
    this.bookList.appendChild(listItem)
  }

  addBook() {
    const title = document.querySelector('#add-book-title').value
    const author = document.querySelector('#add-book-author').value    
    if (title !== '' && author !== '') {
      //create book object, instatiate book
      const newBook = new Book(title, author)
      //Add book to UI
      this.createBookListItem(newBook)
      //Add book to store
      Store.addBookToStorage(newBook)
      this.clearFields()
      this.notEmptyBookListState()
      this.focusField()
      this.showAlert(this.successMessage)
    } else {
      this.showAlert(this.inputValidation)      
    }
  }

  clearFields() {
    document.querySelector('#add-book-title').value = ''
    document.querySelector('#add-book-author').value = ''
  }

  showAlert(element) {
    element.classList.add('show')
    setTimeout(() => {
      element.classList.remove('show')
    }, 3000)
  }

  focusField() {
    document.forms['add-book'].querySelector('#add-book-title').focus()
  }

  notEmptyBookListState() {
    this.emptyListInstruction.classList.remove('show')
    this.hideBooks.classList.add('show')
  }

  emptyBookListState() {
    this.emptyListInstruction.classList.add('show')
    this.hideBooks.classList.remove('show')
  }

  deleteBook(e) {
    if (e.target.classList.contains('delete')) {
      const listItem = e.target.parentElement
      const bookTitle = listItem.querySelector('.book-name').textContent
      listItem.remove()
      Store.removeBookFromStorage(bookTitle)
      if (this.bookList.children.length === 0) {
        this.emptyBookListState()
      }
    }
  }

  displayBooks() {
    const storedBooks = Store.getBooks()
    if (storedBooks.length !== 0) {
      //display the books stored
      storedBooks.forEach(book => this.createBookListItem(book))
      //remove initial instructions and show checkbox to hide the books
      this.notEmptyBookListState()
    }
  }

  filterBooks(e) {
    const term = e.target.value.toLowerCase()
    const books = document.querySelectorAll('#book-list li')
    books.forEach(book => {
      const bookTitle = book
        .querySelector('.book-name')
        .textContent.toLowerCase()
      book.classList.toggle('hide', !bookTitle.includes(term))
    })
  }

  showPanel(e) {
    if (e.target.tagName == 'LI') {
      this.tabsItems.forEach(item => {
        item.classList.toggle('active', e.target === item)
      })
      const targetPanel = document.querySelector(e.target.dataset.target)
      this.panels.forEach(panel => {
        panel.classList.toggle('active', panel === targetPanel)
      })
    }
  }

  hidePanel() {
    this.panels.forEach(panel => {
      panel.classList.remove('active')
    })
    this.tabsItems.forEach(item => {
      item.classList.remove('active')
    })
  }
}

const userInterface = new UI()
//display books when page loads
document.addEventListener('DOMContentLoaded', function () {
  userInterface.displayBooks()
})

//add a book
const addForm = document.forms['add-book']
addForm.addEventListener('submit', function (e) {
  e.preventDefault()
  userInterface.addBook()
})

addForm.addEventListener('click', () => userInterface.hidePanel())

//delete book
const bookList = document.getElementById('book-list')
bookList.addEventListener('click', function (e) {
  userInterface.deleteBook(e)
})

//hide books
const hideCheckBox = document.getElementById('hide-books')
hideCheckBox.addEventListener('change', () => {
  bookList.classList.toggle('hide', hideCheckBox.checked)
})

//filter books
const searchBar = document.getElementById('search-book-title')
searchBar.addEventListener('keyup', userInterface.filterBooks)

searchBar.addEventListener('click', () => userInterface.hidePanel())

//tabs
const tabs = document.querySelector('.tabs')
tabs.addEventListener('click', e => userInterface.showPanel(e))
