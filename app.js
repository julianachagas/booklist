//delete book

const bookList = document.getElementById('book-list')

bookList.addEventListener('click', function (e) {
  if (e.target.className == 'btn delete') {
    const listItem = e.target.parentElement
    bookList.removeChild(listItem)
  }
})

//add book

const addForm = document.forms['add-book']
addForm.addEventListener('submit', function (e) {
  e.preventDefault()
  const newBook = addForm.querySelector("input[type='text']").value
  if (newBook !== '') {
    createListItem(newBook)
    addForm.querySelector("input[type='text']").value = ''
  } else {
    alert('please insert a book title')
  }
})

function createListItem(book) {
  const listItem = document.createElement('li')
  const bookName = document.createElement('span')
  const deleteBtn = document.createElement('button')
  bookName.classList.add('book-name')
  deleteBtn.classList.add('btn', 'delete')
  deleteBtn.textContent = 'delete'
  bookName.textContent = book
  listItem.append(bookName, deleteBtn)
  bookList.appendChild(listItem)
}

//hide books
const hideCheckBox = document.getElementById('hide-books')
hideCheckBox.addEventListener('change', function (e) {
  if (hideCheckBox.checked) {
    bookList.style.display = 'none'
  } else {
    bookList.style.display = 'initial'
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
      book.style.display = 'none'
    } else {
      book.style.display = 'flex'
    }
  })
})

//tabs
const tabs = document.querySelector('.tabs') //ul
const panels = document.querySelectorAll('.panel') //panel divs
tabs.addEventListener('click', function (e) {
  if (e.target.tagName == 'LI') {
    const liItems = tabs.querySelectorAll('li')
    liItems.forEach(item => {
      if (e.target == item) {
        item.classList.add('active')
      } else {
        item.classList.remove('active')
      }
    })
    const targetPanel = document.querySelector(e.target.dataset.target)
    panels.forEach(panel => {
      if (panel == targetPanel) {
        panel.classList.add('active')
      } else {
        panel.classList.remove('active')
      }
    })
  }
})
