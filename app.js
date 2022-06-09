const bookList = document.getElementById('book-list')
const emptyListInstruction = document.querySelector('#empty-list-instruction')
const hideBooks = document.querySelector('#hide-books-wrapper')
const inputValidation = document.querySelector('#input-validation')
const addForm = document.forms['add-book']

//get books from localStorage
function getBooks() {
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

function createBookListItem(bookObject) {
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

function displayBooks() {
  //get the books stored
  const storedBooks = getBooks()
  if (storedBooks.length !== 0) {
    //display the books stored
    storedBooks.forEach(book => createBookListItem(book))
    //remove initial instructions and show checkbox to hide the books
    notEmptyBookListState()
  }
}

function addShowClass(element) {
  element.classList.add('show')
}

function removeShowClass(element) {
  element.classList.remove('show')
}

function notEmptyBookListState() {
  removeShowClass(emptyListInstruction)
  addShowClass(hideBooks)
}

function emptyBookListState() {
  addShowClass(emptyListInstruction)
  removeShowClass(hideBooks)
}

//Event: display books when pages load
document.addEventListener('DOMContentLoaded', displayBooks)

class Book {
  constructor(title) {
    this.title = title
  }
}

function addBookToStorage(bookObject) {
  const storedBooks = getBooks()
  storedBooks.push(bookObject)
  setLocalStorage('books', storedBooks)
}

function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function removeBookFromStorage(bookTitle) {
  const storedBooks = getBooks()
  storedBooks.forEach((item, index) => {
    if (item.title === bookTitle) {
      //remove it from the array
      storedBooks.splice(index, 1)
      //store new array to local storage
      setLocalStorage('books', storedBooks)
    }
  })
}

function clearField() {
  addForm.querySelector("input[type='text']").value = ''
}

function focusField() {
  addForm.querySelector("input[type='text']").focus()
}

function addBook() {
  const title = addForm.querySelector('#add-book-title').value
  //validate
  if (title !== '') {
    //create book object, instatiate book
    const newBook = new Book(title)
    //Add book to UI
    createBookListItem(newBook)
    //Add book to store
    addBookToStorage(newBook)
    removeShowClass(inputValidation)
    notEmptyBookListState()
    clearField()
  } else {
    addShowClass(inputValidation)
    focusField()
  }
}

function deleteBook(e) {
  if (e.target.classList.contains("delete")) {
    const listItem = e.target.parentElement
    const bookTitle = listItem.querySelector('.book-name').textContent
    //remove from UI
    listItem.remove()
    //bookList.removeChild(listItem)
    //remove from storage
    removeBookFromStorage(bookTitle)
    removeShowClass(inputValidation)
    if (bookList.children.length === 0) {
      emptyBookListState()
    }
  }
}

//Event: add a book
addForm.addEventListener('submit', function (e) {
  e.preventDefault()
  addBook()
})

//Event: delete book
bookList.addEventListener('click', deleteBook)

//hide books
const hideCheckBox = document.getElementById('hide-books')
hideCheckBox.addEventListener('change', function () {
  bookList.classList.toggle('hide', hideCheckBox.checked)
})

//tabs
const tabs = document.querySelector('.tabs') //ul
const panels = document.querySelectorAll('.panel') //panel divs
const tabsItems = tabs.querySelectorAll('li')

tabs.addEventListener('click', showPanel)

function showPanel(e) {
  if (e.target.tagName == 'LI') {
    tabsItems.forEach(item => {
      item.classList.toggle('active', e.target == item)
    })
    const targetPanel = document.querySelector(e.target.dataset.target)
    panels.forEach(panel => {
      panel.classList.toggle('active', panel == targetPanel)
    })
  }
  removeShowClass(inputValidation)
}

function hidePanel() {
  panels.forEach(panel => {
    panel.classList.remove('active')
  })
  tabsItems.forEach(item => {
    item.classList.remove('active')
  })
}

//filter books
const searchBar = document.getElementById('search-book-title')
searchBar.addEventListener('keyup', filterBooks)

function filterBooks(e) {
  const term = e.target.value.toLowerCase()
  const books = bookList.querySelectorAll('li')
  books.forEach(book => {
    const bookTitle = book.firstElementChild.textContent.toLowerCase()
    book.classList.toggle('hide', !bookTitle.includes(term))
  })
}

//hide panel when user clicks on the add-books form or search input
addForm.addEventListener('click', hidePanel)
searchBar.addEventListener('click', hidePanel)
//hide input-validation when user clicks on the search input
searchBar.addEventListener('click', function () {
  removeShowClass(inputValidation)
})
