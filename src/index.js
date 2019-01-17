// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

document.addEventListener('DOMContentLoaded', e => {

  const quoteList = document.querySelector('#quote-list')
  const newQuoteForm = document.querySelector('#new-quote-form')

  fetch('http://localhost:3000/quotes')
  .then(res => res.json())
  .then(quotes => quotes.forEach(quote => showQuote(quote)))


  const showQuote = (quote) => {
    quoteList.innerHTML += `<li class='quote-card' id="data-${quote.id}" data-id="${quote.id}">
      <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success' data-id="${quote.id}" >Likes: <span>${quote.likes}</span></button>
        <button class='btn-danger' data-id="${quote.id}">Delete</button>
      </blockquote>
    </li>`
  }

  newQuoteForm.addEventListener('submit', e => {
    e.preventDefault()
    const newQuote = document.querySelector('#new-quote').value
    const author = document.querySelector('#author').value

    const quoteData = {
        quote: newQuote,
        author: author,
        likes: 0
    }

    fetch(`http://localhost:3000/quotes`, {
      method: 'POST',
      body: JSON.stringify(quoteData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(quote => showQuote(quote))

  })

  quoteList.addEventListener('click', e => {
    if(e.target.classList.contains('btn-danger')) {
      const dataId = e.target.dataset.id

      fetch(`http://localhost:3000/quotes/${dataId}`, {
        method: 'DELETE'
      })
      .then(res => res.json())
      .then(quote => document.querySelector(`#data-${dataId}`).remove())

    }
  })

   quoteList.addEventListener('click', e => {
     if (e.target.classList.contains('btn-success')) {
      const dataId = e.target.dataset.id
      const span = e.target.querySelector('span')
      const spanInfo = span.innerText
      const numOfLikes = parseInt(spanInfo)

      fetch(`http://localhost:3000/quotes/${dataId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          likes: numOfLikes + 1
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(quote => span.innerText = quote.likes)

    }
  })


}) // DOMContentLoaded
