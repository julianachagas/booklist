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
  static createBookListItem(bookObject) {
    const bookList = document.getElementById('book-list')
    const listItem = document.createElement('li')
    const bookName = document.createElement('span')
    const deleteBtn = document.createElement('button')
    bookName.classList.add('book-name')
    deleteBtn.classList.add('btn', 'delete')
    deleteBtn.textContent = 'delete'
    bookName.textContent = bookObject.title
    listItem.append(bookName, deleteBtn)    
    bookList.appendChild(listItem)
  }

  static notEmptyBookListState() {
    const emptyListInstruction = document.querySelector(
      '#empty-list-instruction'
    )
    const hideBooks = document.querySelector('#hide-books-wrapper')
    emptyListInstruction.classList.remove('show')
    hideBooks.classList.add('show')
  }

  static emptyBookListState() {
    const emptyListInstruction = document.querySelector(
      '#empty-list-instruction'
    )
    const hideBooks = document.querySelector('#hide-books-wrapper') 
    emptyListInstruction.classList.add('show')
    hideBooks.classList.remove('show')
  }
 
  static displayBooks() {
    //get the books stored
    const storedBooks = Store.getBooks()    
    if (storedBooks.length !== 0) {
      //display the books stored
      storedBooks.forEach(function(book) {
        UI.createBookListItem(book)
      }) 
      //remove initial instructions and show checkbox to hide the books
      UI.notEmptyBookListState() 
    }
  }

  static clearField() {
    document.forms['add-book'].querySelector('#add-book-title').value = ''
  }

  static focusField() {
    document.forms['add-book'].querySelector('#add-book-title').focus()
  }

  static filterBooks(e) {
    const term = e.target.value.toLowerCase()
    const books = bookList.querySelectorAll('li')
    books.forEach(book => {
      const bookTitle = book.firstElementChild.textContent.toLowerCase()
      book.classList.toggle('hide', !bookTitle.includes(term))
    })
  }

  static addBook() {
    const title = document.querySelector('#add-book-title').value
    // validate
    if (title !== '') {
      //create book object, instatiate book
      const newBook = new Book(title)
      //Add book to UI
      UI.createBookListItem(newBook)
      //Add book to store
      Store.addBookToStorage(newBook)
      UI.notEmptyBookListState()
      UI.clearField()
    } else {
      UI.showInputValidation()
      UI.focusField()
    }
  }

  static showInputValidation() {
    const inputValidation = document.querySelector('#input-validation')
    inputValidation.classList.add('show')
    setTimeout(() => {
      inputValidation.classList.remove('show')
    }, 3000)
  }

  static deleteBook(e) {
    const bookList = document.getElementById('book-list')
    if (e.target.classList.contains('delete')) {
      const listItem = e.target.parentElement
      const bookTitle = listItem.querySelector('.book-name').textContent
      //remove from UI
      listItem.remove()
      //remove from storage
      Store.removeBookFromStorage(bookTitle)
      //UI.removeShowClass(inputValidation)
      if (bookList.children.length === 0) {
        UI.emptyBookListState()
      }
    }
  }

  static showPanel(e) {
    const tabs = document.querySelector('.tabs')
    const panels = document.querySelectorAll('.panel')
    const tabsItems = tabs.querySelectorAll('li') 
    if (e.target.tagName == 'LI') {      
      tabsItems.forEach(item => {
        item.classList.toggle('active', e.target == item)
      })
      const targetPanel = document.querySelector(e.target.dataset.target)
      panels.forEach(panel => {
        panel.classList.toggle('active', panel == targetPanel)
      })
    }
  }

  static hidePanel() {
    const tabs = document.querySelector('.tabs')
    const panels = document.querySelectorAll('.panel')
    const tabsItems = tabs.querySelectorAll('li') 
    panels.forEach(panel => {
      panel.classList.remove('active')
    })
    tabsItems.forEach(item => {
      item.classList.remove('active')
    })
  } 
}

//display books when pages load
document.addEventListener('DOMContentLoaded', UI.displayBooks)

//add a book
const addForm = document.forms['add-book']
addForm.addEventListener('submit', function (e) {
  e.preventDefault()
  UI.addBook()
})

//hide panel when user clicks on the form
addForm.addEventListener('click', UI.hidePanel)

//delete book
const bookList = document.getElementById('book-list')
bookList.addEventListener('click', UI.deleteBook)

//hide books
const hideCheckBox = document.getElementById('hide-books')
hideCheckBox.addEventListener('change', function () {
  bookList.classList.toggle('hide', hideCheckBox.checked)
})

//filter books
const searchBar = document.getElementById('search-book-title')
searchBar.addEventListener('keyup', UI.filterBooks)
searchBar.addEventListener('click', UI.hidePanel)

//tabs
const tabs = document.querySelector('.tabs') 
tabs.addEventListener('click', UI.showPanel)

