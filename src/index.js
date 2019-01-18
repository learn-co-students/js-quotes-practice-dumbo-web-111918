// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

document.addEventListener("DOMContentLoaded", () => {

  const quoteList = document.querySelector("#quote-list")
  const newQuoteForm = document.querySelector("#new-quote-form")
  const quotesURL = "http://localhost:3000/quotes"

  //fetch request

  fetch(quotesURL)
    .then(res => res.json())
    .then(renderQuotes)

  function renderQuote(quote) {
    quoteList.innerHTML += `<li class='quote-card' data-id=${quote.id}>
    <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success' data-id="${quote.id}">Likes: <span>${quote.likes}</span></button>
      <button class='btn-danger'>Delete</button>
    </blockquote>
  </li>`

  }
  //when setting multiple .innerHTMLs, use += when rendering to append to quoteList

  function renderQuotes(quotes) {
    quotes.forEach(quote => {
      renderQuote(quote)
    })

    newQuoteForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const userQuote = newQuoteForm.querySelector("#new-quote").value
      const userAuthor = newQuoteForm.querySelector("#author").value

    const option ={
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body:JSON.stringify({"quote": userQuote, "author": userAuthor})
    }

    fetch(quotesURL, option)
      .then(res => res.json())
      .then(renderQuote)
    })
  }

  quoteList.addEventListener("click", (e)=> {
      if(e.target.className === "btn-danger"){
        e.target.parentNode.parentNode.remove();

        const option = {
          method: "DELETE",
          headers: {
            "Content-Type" : "application/json"
          }
        }

        fetch(quotesURL, option)
          .then(res => res.json())
      }
  })

  quoteList.addEventListener("click", (e)=>{
      if(e.target.className === "btn-success"){
        const id = e.target.dataset.id
        const span = e.target.childNodes[1]
        let likesNum = parseInt(span.innerHTML) + 1

        span.innerHTML = likesNum

        const option = {
          method:"PATCH",
          headers:{
            "Content-Type" : "application/json"
          },
          body:JSON.stringify({"likes":likesNum})
        }

        fetch(quotesURL + `/${id}`, option)
          .then(res => res.json())
      }
  })

})
