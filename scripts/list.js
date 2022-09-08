function calculateTotalPrice() {
    let totalPrice = 0;
    document.querySelectorAll(".articlePrice").forEach((priceValue) => {
        totalPrice += parseInt(priceValue.innerHTML.slice(1));
    });
    document.querySelector("#totalPrice").innerHTML = "Total price: $" + totalPrice;
}

function appendProperty(object, propertyName, container) {
    let tag = document.createElement("p");
    if (propertyName === "price") {
        tag.innerHTML += '$';
    }
    tag.innerHTML += object[propertyName];
    tag.classList.add("article" + propertyName[0].toUpperCase() + propertyName.slice(1))
    container.appendChild(tag);
}

function redirectToEdit(id, tag) {
    localStorage.clear();
    localStorage.setItem('id', id)
    window.location.replace("/web-js-labs/edit.html");
}

// EDIT NOT WORKING
function createArticles(articles) {
    articles.forEach((article) => {
        let articleTag = document.createElement("article");
        document.querySelector("#catalogue").appendChild(articleTag);
        Object.getOwnPropertyNames(article).forEach((property) => {
            appendProperty(article, property, articleTag);
            articleTag.innerHTML += `
    <button class="articleDelete" onclick="deleteArticle(${article.id})">Delete</button>
    <button class="articleEdit" onclick="redirectToEdit(${article.id})">Edit</button>
    `
        });
    });

}

function sortByProperty(articleList, property) {
    articleList.sort((a, b) => {
        if (a[property] > b[property]) return 1;
        else if (a[property] < b[property]) return -1;
        else return 0;
    });
}

function sortArticles(articleList) {
    if (document.querySelector("#byAuthor").checked) {
        sortByProperty(articleList, "author");
    } else if (document.querySelector("#byPrice").checked) {
        sortByProperty(articleList, "price");
    } else if (document.querySelector("#byDate").checked) {
        articleList.reverse();
    }
}

function searchByArticleName(articleList, searchPhrase) {
    return articleList.filter(article => article.title.toLowerCase().includes(searchPhrase.toLowerCase()));
}

async function getListOfItems(searchFunction) {
    let response = await fetch("http://127.0.0.1:8000/articles");

    if (response.ok) {
        document.querySelector("#catalogue").innerHTML = "";

        let articles = await response.json();
        if (typeof searchFunction !== 'undefined') {
            articles = searchFunction(articles, document.querySelector("#search").value);
        }
        sortArticles(articles);
        createArticles(articles);
    }
}

async function deleteArticle(id) {
    const sortOption = document.querySelector('input[name="sortRadio"]:checked').id;
    await fetch("http://127.0.0.1:8000/articles/" + id, {
        method: "DELETE"
    });
    await getListOfItems();
    document.querySelector(`#${sortOption}`).checked = true;
}
