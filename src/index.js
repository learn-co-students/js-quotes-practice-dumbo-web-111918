// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading.
function slapQuote(quote){
    let quoteCard = document.createElement('li')
    quoteCard.className = 'quote-card'
    quoteCard.innerHTML = `<blockquote class="blockquote">
    <p class="mb-0" data-quote="${quote.id}">${quote.quote}</p>
    <footer class="blockquote-footer" data-author="${quote.id}">${quote.author}</footer>
    <br>
    <button class='btn-success' data-likes="${quote.id}">Likes: <span>${quote.likes}</span></button>
    <button class='btn-danger' data-id="${quote.id}">Delete</button>
    <button class='btn-edit' data-editid="${quote.id}">Edit</button>
  </blockquote>`
  quoteList.append(quoteCard)
}

function appendPostedQuote(quote){
    slapQuote(quote)
}

function editQuoteOnDOM(quote){
    let editedQuoteText = quoteList.querySelector(`[data-quote="${quote.id}"]`)
    let editedQuoteAuthor = quoteList.querySelector(`[data-author="${quote.id}"]`)
    // let array = Array.from(quoteList.children);
    // let editedQuoteLI = array.filter(q46 => 
    //     q46.querySelector(".delete-button").dataset.quote == quoteId
    //      q46.children[0].children[0].dataset.quote == quote.id
    // )
    editedQuoteText.innerText = quote.quote
    editedQuoteAuthor.innerText = quote.author
}

function renderTheDOM(){
    fetch("http://localhost:3000/quotes")
    .then(res => res.json())
    .then(quotes => quotes.forEach(slapQuote))
}

function resetFormToNew(e){
    quoteForm.innerHTML = 
        `<div class="form-group">
        <label for="new-quote">New Quote</label>
        <input type="text" class="form-control" id="new-quote" placeholder="Learn. Love. Code.">
             </div>
        <div class="form-group">
            <label for="Author">Author</label>
            <input type="text" class="form-control" id="author" placeholder="Flatiron School">
             </div>
        <button type="submit" class="btn btn-primary">Submit</button>`
        quoteForm.dataset.id = ''
}

const quoteList = document.querySelector("#quote-list")
const quoteForm = document.querySelector("#new-quote-form")

quoteForm.elements['new-quote'].value = ''
quoteForm.elements.author.value = ''


renderTheDOM()

quoteForm.addEventListener("submit", function(e){
    e.preventDefault()
    if (e.target.dataset.id){
        let quoteId = e.target.dataset.id
        let newQuote = e.target.elements['new-quote'].value
        let newAuthor = e.target.elements.author.value
        let q = {quote: newQuote, author: newAuthor}
        quoteForm.innerHTML = 
        `<div class="form-group">
        <label for="new-quote">New Quote</label>
        <input type="text" class="form-control" id="new-quote" placeholder="Learn. Love. Code.">
             </div>
        <div class="form-group">
            <label for="Author">Author</label>
            <input type="text" class="form-control" id="author" placeholder="Flatiron School">
             </div>
        <button type="submit" class="btn btn-primary">Submit</button>`
        let div = e.target.parentElement
        div.removeChild(div.firstChild)
        fetch(`http://localhost:3000/quotes/${quoteId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(q)
        }).then(res => res.json())
        .then(editQuoteOnDOM)
    } else{
        let newQuote = e.target.elements['new-quote'].value
        let newAuthor = e.target.elements.author.value
        let q = {quote: newQuote, author: newAuthor, likes: 0}
        e.target.elements.author.value = ""
        e.target.elements['new-quote'].value = ""
        fetch("http://localhost:3000/quotes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(q)
        })
        .then(res => res.json())
        .then(appendPostedQuote)
    }
})

quoteList.addEventListener("click", function(e){
    if (e.target.className === "btn-danger"){
        let quoteId = e.target.dataset.id
        let deletedQuote = quoteList.querySelector(`[data-id="${quoteId}"]`).parentElement.parentElement
        fetch(`http://localhost:3000/quotes/${quoteId}`, {
            method: "DELETE"
        })
        quoteList.removeChild(deletedQuote)
    } else if (e.target.className === "btn-success"){
        let quoteId = e.target.dataset.likes
        let likesBtn = quoteList.querySelector(`[data-likes="${quoteId}"]`)
        let likes = parseInt(likesBtn.lastChild.innerText) + 1
        let updatedQuoteLikeCount = {
            likes: likes
        }
        fetch(`http://localhost:3000/quotes/${quoteId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(updatedQuoteLikeCount)
        })
        likesBtn.lastChild.innerText = likes
    } else if (e.target.className === "btn-edit") {
        let quoteId = e.target.dataset.editid
        let editedQuote = quoteList.querySelector(`[data-quote="${quoteId}"]`)
        let editedAuthor = quoteList.querySelector(`[data-author="${quoteId}"]`)
        quoteForm.innerHTML = 
            `<div class="form-group">
            <label for="new-quote">Edit Quote</label>
            <input type="text" class="form-control" id="new-quote" placeholder="Learn. Love. Code.">
                 </div>
            <div class="form-group">
                <label for="Author">Edit Author</label>
                <input type="text" class="form-control" id="author" placeholder="Flatiron School">
                 </div>
            <button type="submit" class="btn btn-primary">Submit</button>`
        quoteForm.dataset.id = quoteId
        quoteForm.elements['new-quote'].value = editedQuote.innerText
        quoteForm.elements.author.value = editedAuthor.innerText
        if (quoteForm.parentElement.children[0].className !== 'btn-success') {
            let backToNewBtn = document.createElement('button')
            backToNewBtn.innerText = "Back to Make New Quote"
            backToNewBtn.className = 'btn-success'
            backToNewBtn.id = "backToNewForm"
            backToNewBtn.addEventListener("click", resetFormToNew)
            let formDiv = document.querySelector("#quote-form-div")
            formDiv.prepend(backToNewBtn)
        }
    }
})