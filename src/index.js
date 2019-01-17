// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

document.addEventListener("DOMContentLoaded", initialize)

function initialize(){
  getAllQuotes().then(renderQuotes)
  const submitForm = document.querySelector("#new-quote-form");
  const quoteList = document.querySelector("#quote-list");
  const editForm = document.querySelector("#edit-quote-form");
  const sortBtn = document.querySelector("#btn-sort");
  submitForm.addEventListener("submit", submitFormHandler);
  quoteList.addEventListener("click", deleteHandler);
  quoteList.addEventListener("click", likesHandler);
  quoteList.addEventListener("click", editHandler);
  editForm.addEventListener("submit", submitEditHandler);
  sortBtn.addEventListener("click", sortAuthors);

}

function sortAuthors() {
  getAllQuotes()
  .then(quotesArray => console.log(quotesArray.map(quote => quote.author).sort()))

}

function renderQuotes(quotesArray){
  quotesArray.forEach(quote => showQuotes(quote))
}

function showQuotes(quote){
    const quoteList = document.querySelector("#quote-list")
    quoteList.innerHTML += `<li data-id=${quote.id} class='quote-card'>
    <blockquote class="blockquote">
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">Author: ${quote.author}</footer>
    <br>
    <button class='btn-success'>Likes: <span>${quote.likes}</span></button>
    <button class='btn-danger'>Delete</button>
    <button data-id=${quote.id} class='btn-edit'>Edit</button>
    </blockquote>
    </li>`
}

function submitFormHandler(event){
  event.preventDefault()
  const newQuote = event.target[0].value
  const newAuthor = event.target[1].value
  const quoteObj = {"quote": newQuote, "author": newAuthor, "likes": 0}
  postQuote(quoteObj).then(showQuotes)
}

function deleteHandler(event){
  //console.log(event.target)
  if(event.target.classList.contains("btn-danger")){
    const quoteList = document.querySelector("#quote-list")
    let id = event.target.parentNode.parentNode.dataset.id;
    let quoteLi = event.target.parentNode.parentNode
    quoteLi.remove();
    deleteQuote(id);
  }
}

function likesHandler(event){
  const quoteList = document.querySelector("#quote-list")
  if(event.target.classList.contains("btn-success")){
  let likes = (event.target.children[0].innerText);
  // let likes = document.querySelector(".btn-success span")
  // likes.innerText = parseInt(likes) + 1
  let id = event.target.parentNode.parentNode.dataset.id;
  likes = parseInt(likes) + 1
  console.log(likes);
  event.target.children[0].innerText = likes
  updateLikes(id, likes);
  }
}

function editHandler(event){
  event.preventDefault();
  populateEditForm(event)
}

function populateEditForm(event){
  const editForm = document.getElementById("edit-quote-form")
  const editField = document.getElementById("edit-quote")
  const quoteList = document.querySelector("#quote-list")
  const authorField = document.getElementById("edit-author")
  if(event.target.classList.contains("btn-edit")){
    editForm.style.display = "block";
    window.id = event.target.parentNode.parentNode.dataset.id
    let selectedLi = quoteList.querySelector('[data-id="'+id+'"]')
    editField.value = selectedLi.querySelector(".mb-0").innerText;
    authorField.value = selectedLi.querySelector(".blockquote-footer").innerText.split(" ").slice(1).join(" ")
  }
}

function submitEditHandler(event){
  event.preventDefault()
  const editForm = document.getElementById("edit-quote-form")
  const editedQuote = event.target[0].value
  const editedAuthor = event.target[1].value
  const quoteList = document.querySelector("#quote-list")
  const editedQuoteObj = {"quote": editedQuote, "author": editedAuthor}
  updateQuote(id, editedQuoteObj).then(data => {
    let selectedLi = quoteList.querySelector('[data-id="'+id+'"]')
    selectedLi.querySelector(".mb-0").innerText = data.quote;
    selectedLi.querySelector(".blockquote-footer").innerText = data.author
  })
  editForm.style.display = "none"
}


/// PUT FETCHES HERE
const quoteURL = "http://localhost:3000/quotes"

function getAllQuotes(){
  return fetch(quoteURL)
    .then(response => response.json())
}

function postQuote(quoteObj){
  const options = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accepts': 'application/json'
    },
    body: JSON.stringify(quoteObj)
    }
  return fetch(quoteURL, options)
    .then(response => response.json())
}

function deleteQuote(id){
  const options = {
    method: "DELETE"
  }
  return fetch(quoteURL + `/${id}`, options)
}

function updateLikes(id, likes){
  const option = {
    method: "PATCH",
    headers: {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify({likes: likes})
  }

  return fetch(quoteURL + `/${id}`, option)
}

function updateQuote(id, editedQuoteObj){
  const option = {
    method: "PATCH",
    headers: {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify(editedQuoteObj)
  }

  return fetch(quoteURL + `/${id}`, option)
    .then(response => response.json())
}
