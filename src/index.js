// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.


//selectors here
const quoteList = document.querySelector("#quote-list")
const url = `http://localhost:3000/quotes`
const quoteForm = document.querySelector("#new-quote-form")


//fetches here //dont need brackets for fetch unless have object pass in
  fetch(url)
    .then(function(response){
       return response.json()
       //console.log(response)
    })
    .then(function(data){
       //console.log(data)
       data.forEach(renderQuote) //no brackets here

    })//end of fetch


//listeners here
   quoteForm.addEventListener("submit", function(event){
      event.preventDefault()

      let newQuote = event.target.elements["new-quote"].value
      let newAuthor = event.target.elements.author.value

      //creates object
      let q = {
        quote: newQuote,
        author: newAuthor,
        likes: 0  //set object to 0 at beginning
      }

      fetch(url,
       {
      	method: "POST",

        headers: {
        	"Content-Type": "application/json",
        	"Accept": "application/json"
        },
        body: JSON.stringify(q)
      })

    .then(function(response){
    	 return response.json()
    })
    .then(function(data){
    	  //post gives you back the object you created so just append
    	  renderQuote(data)
    })

   }); //end of listener

    //for delete
  quoteList.addEventListener("click", function(event){

   //assigning id right here to the right one
   //YOU HAVE TO MAKE IT ON THE DELETE BUTTON
    if (event.target.className === "btn-danger") {
	    let quoteId = parseInt(event.target.dataset.id)

	    let selectedCard =(event.target.parentNode.parentNode)

	//its added to the form on delete button, also on card
	    fetch(`http://localhost:3000/quotes/${quoteId}`,
	     {
	 	    method: "Delete"
       })
      //end of object and fetch

        .then(function(){

        })
        quoteList.removeChild(selectedCard)
       }//end of if

    else if (event.target.className === 'btn-success') {
      //let likesNum = event.target.innerHTML.split(" ")[1]
         //likesNum = parseInt(likesNum) + 1
         //can put an id on spanLikes where you selected it!
         let spanLikes = event.target.querySelector(".spanLikes")
         let likesNum = spanLikes.innerHTML
         likesNum = parseInt(likesNum) + 1

         let selectedCard =(event.target.parentNode.parentNode)
         let quoteId = event.target.parentNode.parentNode.dataset.id

       let opts =
      {
        likes: likesNum
        }

      fetch(`http://localhost:3000/quotes/${quoteId}`,
        {
         method: "PATCH",

         headers: {
                   "Content-Type": "application/json",
                   "Accept": "application/json"
                   },
         body: JSON.stringify(opts)
        } //end of object

        )//end of fetch

        .then(function (response){
            return response.json();
        })
        .then(function(data){
           spanLikes.innerHTML = `${likesNum}`
           //how do i get the item

        })

      }//end of if for like
   })//end of listener



   //function helpers here
  function renderQuote(quote){
    let quoteCard = document.createElement("li")
     quoteCard.className = "quote-card"
     quoteCard.dataset.id = quote.id
    //put everything inside of in a string with backticks
    quoteCard.innerHTML= `<blockquote class="blockquote">
        <p class="mb-0">/${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span class = 'spanLikes'>${quote.likes}</span></button>
        <button class='btn-danger', data-id = "${quote.id}">Delete</button>
      </blockquote>`
      quoteList.append(quoteCard); //append load more than one thing, append strings vs child
  }

