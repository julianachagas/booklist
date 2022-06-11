class Book {
  constructor(title) {
    this.title = title
  }
}

class Store {
  //get books from localStorage
  static getBooks() {
    let books
    //check if there is no item stored (null), create an empty array
    if (!localStorage.getItem('books')) {
      books = []
    } else {
      //get the string stored in localStorage and turn into an array
      books = JSON.parse(localStorage.getItem('books'))
    }
    //returns an empty array or array of stored books
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
        //remove it from the array
        storedBooks.splice(index, 1)
      }
    })
    //store new array to local storage
    Store.setLocalStorage('books', storedBooks)
  }
}

class UI {
  constructor() {
    this.bookList = document.getElementById('book-list')
    this.emptyListInstruction = document.querySelector(
      '#empty-list-instruction'
    )
    this.hideBooks = document.querySelector('#hide-books-wrapper')
    this.tabs = document.querySelector('.tabs')
    this.panels = document.querySelectorAll('.panel')
    this.tabsItems = document.querySelectorAll('.tabs li')
  }

  createBookListItem(bookObject) {
    //const bookList = document.getElementById('book-list')
    const listItem = document.createElement('li')
    const bookName = document.createElement('span')
    const deleteBtn = document.createElement('button')
    bookName.classList.add('book-name')
    deleteBtn.classList.add('btn', 'delete')
    deleteBtn.textContent = 'delete'
    bookName.textContent = bookObject.title
    listItem.append(bookName, deleteBtn)
    this.bookList.appendChild(listItem)
  }

  addBook() {
    const title = document.querySelector('#add-book-title').value
    // validate
    if (title !== '') {
      //create book object, instatiate book
      const newBook = new Book(title)
      //Add book to UI
      this.createBookListItem(newBook)
      //Add book to store
      Store.addBookToStorage(newBook)
      this.clearField()
      this.notEmptyBookListState()
    } else {
      this.showInputValidation()
      this.focusField()
    }
  }

  clearField() {
    document.forms['add-book'].querySelector('#add-book-title').value = ''
  }

  showInputValidation() {
    const inputValidation = document.querySelector('#input-validation')
    inputValidation.classList.add('show')
    setTimeout(() => {
      inputValidation.classList.remove('show')
    }, 3000)
  }

  focusField() {
    document.forms['add-book'].querySelector('#add-book-title').focus()
  }

  notEmptyBookListState() {
    this.emptyListInstruction.classList.remove('show')
    this.hideBooks.classList.add('show')
  }

  deleteBook(e) {
    //const bookList = document.getElementById('book-list')
    if (e.target.classList.contains('delete')) {
      const listItem = e.target.parentElement
      const bookTitle = listItem.querySelector('.book-name').textContent
      //remove from UI
      listItem.remove()
      //remove from storage
      Store.removeBookFromStorage(bookTitle)
      if (this.bookList.children.length === 0) {
        this.emptyBookListState()
      }
    }
  }

  emptyBookListState() {
    this.emptyListInstruction.classList.add('show')
    this.hideBooks.classList.remove('show')
  }

  displayBooks() {
    //get the books stored
    const storedBooks = Store.getBooks()
    if (storedBooks.length !== 0) {
      //display the books stored
      for (let book of storedBooks) {
        this.createBookListItem(book)
      } //forEach doesn't work here, this would be undefined
      //remove initial instructions and show checkbox to hide the books
      this.notEmptyBookListState()
    }
  }

  filterBooks(e) {
    const bookList = document.getElementById('book-list')
    const term = e.target.value.toLowerCase()
    const books = bookList.querySelectorAll('li')
    books.forEach(book => {
      const bookTitle = book.firstElementChild.textContent.toLowerCase()
      book.classList.toggle('hide', !bookTitle.includes(term))
    })
  }

  showPanel(e) {
    if (e.target.tagName == 'LI') {
      this.tabsItems.forEach(item => {
        item.classList.toggle('active', e.target == item)
      })
      const targetPanel = document.querySelector(e.target.dataset.target)
      this.panels.forEach(panel => {
        panel.classList.toggle('active', panel == targetPanel)
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
//display books when pages load
document.addEventListener('DOMContentLoaded', function () {
  userInterface.displayBooks()
})

//add a book
const addForm = document.forms['add-book']
addForm.addEventListener('submit', function (e) {
  e.preventDefault()
  userInterface.addBook()
})

addForm.addEventListener('click', function () {
  userInterface.hidePanel()
})

//delete book
const bookList = document.getElementById('book-list')
bookList.addEventListener('click', function (e) {
  userInterface.deleteBook(e)
})
//if puts deleteBook directly, this will point to booklist

//hide books
const hideCheckBox = document.getElementById('hide-books')
hideCheckBox.addEventListener('change', function () {
  bookList.classList.toggle('hide', hideCheckBox.checked)
})

const searchBar = document.getElementById('search-book-title')
searchBar.addEventListener('keyup', userInterface.filterBooks) //this works because filter books doesn't use this keyword
searchBar.addEventListener('click', function () {
  userInterface.hidePanel()
})

//tabs
const tabs = document.querySelector('.tabs')
tabs.addEventListener('click', function (e) {
  userInterface.showPanel(e)
})
