const quotesURL = 'http://localhost:3000/quotes'
const quoteListUl = document.querySelector('#quote-list')
const quoteForm = document.getElementById("new-quote-form")

document.addEventListener('DOMContentLoaded', () => {
  getQuotes()

  quoteForm.addEventListener("submit", e => {
    e.preventDefault()

    let quoteText = document.getElementById("new-quote").value
    let authorName = document.getElementById("author").value
    let likes = 0

    fetch(quotesURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(
          { quote: quoteText, likes: likes, author: authorName }
      )
    }).then(res => res.json())
      .then(data => {
        quoteListUl.append(makeQuoteLi(data));
      })
  })

 quoteListUl.addEventListener('click', e =>{
    if (e.target.className === 'btn-success'){
      likeButton(e.target)
    } else if (e.target.className === 'btn-danger'){
      deleteButton(e.target)
    } else if (e.target.className === "btn-edit") {
      editButton(e)
    } else if (e.target.className === 'btn btn-primary')
      submitEdit(e)
  })
  console.log('dom loaded')
})

function getQuotes(){
  fetch(quotesURL)
  .then(res => res.json())
  .then(quotes => {
    quotes.forEach(quote => {
      quoteListUl.append(makeQuoteLi(quote))
    })
  })
}

function makeQuoteLi(quote){
  let li = document.createElement('li')
  li.className = 'quote-card'
  li.id = `quote-${quote.id}`
  // li.dataset.id = quote.id
  li.innerHTML =
  `<blockquote class="blockquote">
    <p id="quote-text-${quote.id}">${quote.quote}</p>
    <footer id= "author-text-${quote.id}"class="blockquote-footer">${quote.author}</footer>
    <br>
    <button class='btn-success' data-id= ${quote.id}>Likes: <span>${quote.likes}</span></button>
    <button class='btn-danger' data-id= ${quote.id}>Delete</button>

    <button class='btn-edit' data-id= ${quote.id}>Edit</button>
      <form class="edit-quote-form" style="display:none;" id=edit-form-${quote.id} >
        <div class="form-group edit-form" >
          <label for="new-quote">Edit Quote</label>
          <input type="text" class="form-control" id="edit-quote" placeholder="${quote.quote}">
        </div>
        <div class="form-group edit-author-form">
          <label for="Author">Edit Author</label>
          <input type="text" class="form-control" id="edit-author" placeholder="${quote.author}">
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>


  </blockquote>`
  return li;
}

function likeButton(button){
  let quoteId = button.dataset.id
  let likes = button.querySelector('span')
  let likesParsed = parseInt(button.querySelector('span').innerText)
  likesParsed++

  fetch(quotesURL + `/${quoteId}`, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ likes: likesParsed })
  })
  .then(res => res.json())
  .then(data => { likes.innerText = data.likes })
}

function deleteButton(button){
  // quoteId
  let quoteId = button.dataset.id
  let ul = button.currentTarget

  fetch(quotesURL + `/${quoteId}`, {
    method: 'DELETE',
  })
  .then(quote => {

    document.querySelector(`#quote-${quoteId}`).remove()
    // ul.querySelector(`[data-id="${quoteId}"]`).remove()
  })
}

function editButton(button){

  let quoteId = button.target.dataset.id
  let btn = document.getElementById(`edit-form-${quoteId}`)

  if (btn.style.display === "none") {
    btn.style.display = "block"
  } else {
    btn.style.display = "none"
  }
}

function submitEdit(e){
  e.preventDefault()
  let quoteId = e.target.parentElement.previousElementSibling.dataset.id
  let btn = document.getElementById(`edit-form-${quoteId}`)
  let editText = e.target.parentElement.children[0].children[1].value
  let authorText = e.target.parentElement.children[1].children[1].value
  let textArea = document.getElementById(`quote-text-${quoteId}`);
  let authorArea = document.getElementById(`author-text-${quoteId}`)

  fetch(quotesURL + `/${quoteId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      quote: editText,
      author: authorText
    })
  })
  .then(r => r.json())
  .then(data => {
    textArea.innerText = data.quote;
    authorArea.innerText = data.author;
    btn.style.display = "none"
  })
}
