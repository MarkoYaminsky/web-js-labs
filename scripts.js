class Article {
    constructor(json) {
        Object.assign(this, json);
    }
}

function calculateTotalPrice() {
    let totalPrice = 0;
    document.querySelectorAll(".articlePrice").forEach(function (priceValue) {
        totalPrice += parseInt(priceValue.innerHTML.slice(1));
    });
    document.querySelector("#totalPrice").innerHTML = "Total price: $" + totalPrice;
}

function appendArticle(object, propertyName, container) {
    let tag = document.createElement("p");
    if (propertyName === "price") {
        tag.innerHTML += '$';
    }
    tag.innerHTML += object[propertyName];
    tag.classList.add("article" + propertyName[0].toUpperCase() + propertyName.slice(1))
    container.appendChild(tag);
}

function sortByProperty(articleList, property) {
    articleList.sort(function (a, b) {
        if (a[property] > b[property]) return 1; else if (a[property] < b[property]) return -1; else return 0;
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

        articles.forEach(function (articleObj) {
            let article = new Article(articleObj);
            let articleTag = document.createElement("article");
            document.querySelector("#catalogue").appendChild(articleTag);
            Object.getOwnPropertyNames(article).forEach(function (property) {
                if (property !== "id") appendArticle(article, property, articleTag);
            });
        });
    }
}
