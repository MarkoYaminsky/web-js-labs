function formArticle() {
    return {
        "title": document.querySelector("#articleTitle").value,
        "author": document.querySelector("#articleAuthor").value,
        "price": document.querySelector("#articlePrice").value,
    }
}

async function createArticle() {
    const articleObj = formArticle();
    await fetch("http://127.0.0.1:8000/articles", {
        method: "POST",
        body: JSON.stringify(articleObj),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        if (response.ok) alert("Success!")
        else alert("Error! Failed to publish new article.")
    });
}

async function editArticle() {
    const id = localStorage.getItem('id');
    const articleObj = formArticle();
    console.log(id);
    await fetch("http://127.0.0.1:8000/articles/" + id, {
        method: "PUT",
        body: JSON.stringify(articleObj),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        if (response.ok) alert("Success!")
        else alert("Error! Failed to edit an article.")
    });
}
