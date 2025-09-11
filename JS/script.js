var pageNames = document.getElementsByClassName("pageName");

// recuperer la page actuelle si elle existe afficher la page actuelle en white
var pageActuelle = window.location.href.split("/").pop();

for (var i = 0; i < pageNames.length; i++) {
    if (pageNames[i].textContent == pageActuelle) {
        pageNames[i].style.color = "white";
    }
}
