// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

document.addEventListener('DOMContentLoaded', e => {
  const quoteList = document.querySelector('#quote-list')
  const newQuoteForm = document.querySelector('#new-quote-form')

  fetch('http://localhost:3000/quotes')
  .then(res => res.json())
  .then(quotes => quotes.forEach(quote => showQuote(quote)))

  const showQuote = (quote) => {
    quoteList.innerHTML += `<li class='quote-card' id="quote-${quote.id}" data-id="${quote.id}">
    <blockquote class="blockquote">
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
    <button class='btn-success'>Likes: <span>${quote.likes}</span></button>
    <button class='btn-danger' data-id="${quote.id}">Delete</button>
    </blockquote>
    </li>`
  }

  quoteList.addEventListener('click', e => {
    if(e.target.classList.contains('btn-danger')) {
      // const quoteId = e.target.parentNode.parentNode.dataset.id; //('data-id')
      const quoteId = e.target.dataset.id

      fetch(`http://localhost:3000/quotes/${quoteId}`, {
        method: 'DELETE'
      })
      .then(res => res.json())
      .then(quote => document.querySelector(`#quote-${quoteId}`).remove())
    }
  })

  newQuoteForm.addEventListener('submit', e => {
    e.preventDefault()
    const newQuote = document.querySelector('#new-quote').value
    const author = document.querySelector('#author').value

    newData = {
      quote: newQuote,
      author: author,
      likes: 0
    }

    fetch('http://localhost:3000/quotes', {
      method: 'POST',
      body: JSON.stringify(newData),
      headers: {
        'Content-Type': 'application/json'
      }

    })
    .then(res => res.json())
    .then(quote => showQuote(quote))

  })

  quoteList.addEventListener('click', e => {
    if(e.target.classList.contains('btn-success')) {
      const quoteId = e.target.parentNode.parentNode.getAttribute('data-id')
      const span = e.target.parentNode.querySelector('span')
      const spanValue = span.innerText
      const likes = parseInt(spanValue)


      fetch(`http://localhost:3000/quotes/${quoteId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          likes: likes + 1
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(quote => span.innerText = quote.likes)

    }
  })


})
