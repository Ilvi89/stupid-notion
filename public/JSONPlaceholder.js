
document.addEventListener("DOMContentLoaded", function () {
  var p = Math.floor(Math.random() * 10)
  fetch(`https://jsonplaceholder.typicode.com/posts?_page=${p}&_limit=5`)
    .then(async function (response) {
      if (!response.ok) {
        console.log(response);
        throw Error(response.status);
      }
      hideLoader()
      renderList(await response.json())
    })
    .catch(async (error) => {
      hideLoader()
      showErrInfo(error)
    });
  
});





function renderList(json) {
  json.forEach(e => {
    renderPost(e)
  });
}

function renderPost(post) {
  var list = document.getElementById("posts-list")
  list.appendChild(htmlToElement(`\
  <li class="qa">
    <h3 class="quest">${post.title}</h3>
    <p class="answer">${post.body}</p>
  </li>`
  ))
}


function hideLoader() {
  var loader = document.getElementById("loading")
  loader.className += "loaded"
}

function showErrInfo(err) {
  var list = document.getElementById("posts-list")
  list.appendChild(htmlToElement(`\
  <h1>${err}</h1>`
  ))
}
