const bookList = document.getElementById('book-list')
const emptyListInstruction = document.querySelector('#empty-list-instruction')
const hideBooks = document.querySelector('#hide-books-wrapper')
const inputValidation = document.querySelector('#input-validation')

function addShowClass(element) {
  element.classList.add('show')
}

function removeShowClass(element) {
  element.classList.remove('show')
}

function emptyBookListState() {
  addShowClass(emptyListInstruction)
  removeShowClass(hideBooks)
}

function notEmptyBookListState() {
  removeShowClass(emptyListInstruction)
  addShowClass(hideBooks)
}

//delete book
bookList.addEventListener('click', function (e) {
  if (e.target.tagName == 'BUTTON') {
    const listItem = e.target.parentElement
    bookList.removeChild(listItem)
    removeShowClass(inputValidation)    
    if (bookList.children.length === 0) {
      emptyBookListState()
    }
  }
})

//add book

const addForm = document.forms['add-book']

addForm.addEventListener('submit', function (e) {
  e.preventDefault()
  const newBook = addForm.querySelector("input[type='text']").value
  if (newBook !== '') {
    bookList.appendChild(createBookListItem(newBook))
    notEmptyBookListState()
    removeShowClass(inputValidation)    
    addForm.querySelector("input[type='text']").value = ''
  } else {
    addShowClass(inputValidation)    
    addForm.querySelector("input[type='text']").focus()
  }
})

function createBookListItem(book) {
  const listItem = document.createElement('li')
  const bookName = document.createElement('span')
  const deleteBtn = document.createElement('button')
  bookName.classList.add('book-name')
  deleteBtn.classList.add('btn', 'delete')
  deleteBtn.textContent = 'delete'
  bookName.textContent = book
  listItem.append(bookName, deleteBtn)
  return listItem
}

//hide books
const hideCheckBox = document.getElementById('hide-books')
hideCheckBox.addEventListener('change', function () {
  bookList.classList.toggle('hide', hideCheckBox.checked)
})

//filter books
const searchBar = document.getElementById('search-book-title')
searchBar.addEventListener('keyup', function (e) {
  const term = e.target.value.toLowerCase()
  const books = bookList.querySelectorAll('li')
  books.forEach(book => {
    const bookTitle = book.firstElementChild.textContent.toLowerCase()
    book.classList.toggle('hide', !bookTitle.includes(term))
  })
})

//tabs

const tabs = document.querySelector('.tabs') //ul
const panels = document.querySelectorAll('.panel') //panel divs
const liItems = tabs.querySelectorAll('li')

tabs.addEventListener('click', function (e) {
  if (e.target.tagName == 'LI') {
    liItems.forEach(item => {
      item.classList.toggle('active', e.target == item)
    })
    const targetPanel = document.querySelector(e.target.dataset.target)
    panels.forEach(panel => {
      panel.classList.toggle('active', panel == targetPanel)
    })
  }
  removeShowClass(inputValidation)  
})

function hidePanel() {
  panels.forEach(panel => {
    panel.classList.remove('active')
  })
  liItems.forEach(item => {
    item.classList.remove('active')
  })
}

//hide panel when user clicks on the add-books form or search input
addForm.addEventListener('click', hidePanel)
searchBar.addEventListener('click', hidePanel)
//hide input-validation when user clicks on the search input
searchBar.addEventListener('click', function () {
  removeShowClass(inputValidation)
})
