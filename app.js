const bookList = document.getElementById('book-list')
const emptyListInstruction = document.querySelector('#empty-list-instruction')
const hideBooks = document.querySelector('#hide-books-wrapper')
const inputValidation = document.querySelector('#input-validation')

function changeDisplayProperty(element, value) {
  element.style.display = value
}

function emptyBookListState() {
  changeDisplayProperty(emptyListInstruction, 'flex')
  changeDisplayProperty(hideBooks, 'none')
}

function notEmptyBookListState() {
  changeDisplayProperty(emptyListInstruction, 'none')
  changeDisplayProperty(hideBooks, 'flex')
}

//delete book
bookList.addEventListener('click', function (e) {
  if (e.target.tagName == 'BUTTON') {
    const listItem = e.target.parentElement
    bookList.removeChild(listItem)
    changeDisplayProperty(inputValidation, "none")
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
    changeDisplayProperty(inputValidation, 'none')
    addForm.querySelector("input[type='text']").value = ''
  } else {
    changeDisplayProperty(inputValidation, 'flex')
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
  if (hideCheckBox.checked) {
    changeDisplayProperty(bookList, 'none')
  } else {
    changeDisplayProperty(bookList, 'initial')
  }
})

//filter books
const searchBar = document.getElementById('search-book-title')
searchBar.addEventListener('keyup', function (e) {
  const term = e.target.value.toLowerCase()
  const books = bookList.querySelectorAll('li')
  books.forEach(book => {
    const bookTitle = book.firstElementChild.textContent.toLowerCase()
    if (!bookTitle.includes(term)) {
      changeDisplayProperty(book, 'none')
    } else {
      changeDisplayProperty(book, 'flex')
    }
  })
})

//tabs

function addClassActive(element) {
  element.classList.add('active')
}

function removeClassActive(element) {
  element.classList.remove('active')
}

const tabs = document.querySelector('.tabs') //ul
const panels = document.querySelectorAll('.panel') //panel divs
const liItems = tabs.querySelectorAll('li')

tabs.addEventListener('click', function (e) {
  if (e.target.tagName == 'LI') {
    liItems.forEach(item => {
      if (e.target == item) {
        addClassActive(item)
      } else {
        removeClassActive(item)
      }
    })
    const targetPanel = document.querySelector(e.target.dataset.target)
    panels.forEach(panel => {
      if (panel == targetPanel) {
        addClassActive(panel)
      } else {
        removeClassActive(panel)
      }
    })
  }
  changeDisplayProperty(inputValidation, 'none')
})

function hidePanel() {
  panels.forEach(panel => {
    removeClassActive(panel)
  })
  liItems.forEach(item => {
    removeClassActive(item)
  })
}

//hide panel when user clicks on the add-books form or search input
addForm.addEventListener('click', hidePanel)
searchBar.addEventListener('click', hidePanel)
//hide input-validation when user clicks on the search input
searchBar.addEventListener('click', function () {
  changeDisplayProperty(inputValidation, 'none')
})
