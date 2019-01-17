

// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
document.addEventListener("DOMContentLoaded", () => {
  const quoteList = document.getElementById('quote-list')
  const form = document.getElementById('new-quote-form')

  quoteList.addEventListener('click', delegateBtn)
  form.addEventListener('submit', newQuote)

  renderAllQuotes()

})


function newQuote(e) {
  e.preventDefault()
  let newQuote = document.querySelector('#new-quote').value
  let newAuthor = document.querySelector('#author').value
  let object = {quote: newQuote, author: newAuthor, likes: 0}
  fetch("http://localhost:3000/quotes", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(object)
  })
  .then(res => res.json())
  .then(data => {
    let quoteList = document.querySelector("#quote-list")
    let card = document.createElement('li')
    card.className = 'quote-card'
    let html = `<blockquote class="blockquote">
          <p class="mb-0">${data.quote}</p>
          <footer class="blockquote-footer">${data.author}</footer>
          <br>
          <button class='btn-success button-like'>Likes: <span>${data.likes}</span></button>
          <button class='btn-danger button-delete'>Delete</button>
        </blockquote>
    `
    card.innerHTML = html
    quoteList.append(card)
  })
}

function delegateBtn(e) {
  if (e.target.className.includes("button-like")) {
    let a = e.target.querySelector('span')
    let likes = Number(a.innerText)
    likes++
    a.innerText = likes
    console.log(a.innerText)
    let methods = {
      method:"PATCH",
      body: JSON.stringify({likes: likes}),
      headers: {
        'Content-Type' : 'application/json',
      }
    }
    fetchUpdate(e.target.dataset.id, methods)
  } else if (e.target.className.includes("button-delete")) {
    let card = e.target.parentElement.parentElement
    card.parentElement.removeChild(card)
    let methods = {
      method:"DELETE"
    }
    fetchUpdate(e.target.dataset.id, methods)
    .then(console.log)
  }
}

function fetchUpdate(id, methods) {
  return fetch(`http://localhost:3000/quotes/${id}`, methods)
  .then(res => res.json())
}



function fetchAll() {
  return fetch("http://localhost:3000/quotes")
  .then(res => res.json())
}

function renderAllQuotes() {
  let quoteList = document.querySelector("#quote-list")
  quoteList.innerHTML= ""
  fetchAll().then(quotes => {
    quotes.forEach((data) => {
      let card = document.createElement('li')
      card.className = 'quote-card'
      let html = `<blockquote class="blockquote">
            <p class="mb-0">${data.quote}</p>
            <footer class="blockquote-footer">${data.author}</footer>
            <br>
            <button data-id="${data.id}" class='btn-success button-like'>Likes: <span>${data.likes}</span></button>
            <button data-id="${data.id}" class='btn-danger button-delete'>Delete</button>
          </blockquote>
      `
      card.innerHTML = html
      quoteList.append(card)
    })
  })
}
