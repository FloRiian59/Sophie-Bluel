// Variables //

const galerie = document.querySelector(".gallery")
const boutons = document.querySelector(".buttons")

// Récupération des données des works via l'API //

async function getWorks() {
    const reponse = await fetch("http://localhost:5678/api/works");
    return await reponse.json();
}
getWorks();

// Récupération des données des catégories via l'API //

async function getCategorie() {
    const reponse = await fetch("http://localhost:5678/api/categories");
    return await reponse.json();
}
getCategorie();

// Fonctions pour faire apparaitre la galerie en JS dans le DOM //

async function displayWorks() {
    galerie.innerHTML = "";
    const works = await getWorks();
    works.forEach((work) => {
        createWorkCard(work);
    });
}
displayWorks();

function createWorkCard(work) {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");
        figure.appendChild(img);
        figure.appendChild(figcaption);
        galerie.appendChild(figure);
        img.src = work.imageUrl;
        figcaption.textContent = work.title;
}

// display des boutons //

async function displayButtons() {
    const categories = await getCategorie();
    categories.forEach(categorie => {
        const bouton = document.createElement("button")
        bouton.textContent = categorie.name;
        bouton.id = categorie.id;
        boutons.appendChild(bouton);
    });
}
displayButtons();

// Fonctions de filtrage au clique des boutons //

async function filterCategorie() {
    const gallery = await getWorks();
    const boutons = document.querySelectorAll(".buttons button")
    boutons.forEach(button => {
        button.addEventListener("click", (event)=> {
            const boutonId = event.target.id;
            galerie.innerHTML = "";
            if (boutonId !== "all") {
                const galleryCategorie = gallery.filter((work) => {
                    return work.categoryId == boutonId;
                });
                galleryCategorie.forEach(work => {
                    createWorkCard(work);
                });
            }else {
                displayWorks();
            }
        });
    });
}
filterCategorie();

// Si l'utilisateur est connecté //

const logged = window.sessionStorage.logged;

const logout = document.querySelector("nav a")
const modifierImg = document.querySelector("#portfolio .fa-pen-to-square")
const modifierTxt = document.querySelector(".modifier")
const adminBanner = document.querySelector(".Banner-admin")
const header = document.getElementById("header")


// Fonction permetant d'afficher la bannier admin et login et logout en fonction du statut de l'utilisateur

function userLoged(){
    if (logged === "true") {
        modifierImg.style.display = "flex";
        modifierTxt.style.display = "flex";
        adminBanner.style.display = "flex";
        header.style.margin = "90px 0px 50px 0px";
        logout.textContent = "logout";
        logout.addEventListener("click", ()=>{
            window.sessionStorage.logged = false;
        })
    }
}
userLoged();
// Variables liées à la modale
const displayModale = document.querySelector("#portfolio a");
const modaleBackground = document.querySelector(".modale_background");
const modaleContainer = document.querySelector(".modale_container");
const closeModale = document.querySelectorAll(".fa-xmark");
const modaleGalerie = document.querySelector(".modale_galerie");

// Affichage de la modale depuis le bouton modifier
displayModale.addEventListener("click", ()=>{
    modaleBackground.style.display = "flex";
});
// Fermeture de la modale depuis la croix
closeModale.forEach(croix => {
    croix.addEventListener("click", ()=>{
        modaleBackground.style.display = "none";
    })
});
// Fermeture de la modale si on clique sur le background
modaleBackground.addEventListener("click", (event)=> {
    if (event.target.className === "modale_background") {
        modaleBackground.style.display = "none"
    }
});

// Affichage de la galerie dans la modale

async function displayGalerieModale() {
    modaleGalerie.innerHTML = "";
    const galerie = await getWorks();
    galerie.forEach(work => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const span = document.createElement("span");
        const trashcan = document.createElement("i");
        trashcan.classList.add("fa-solid","fa-trash-can");
        trashcan.id = work.id;
        img.src = work.imageUrl;
        span.appendChild(trashcan);
        figure.appendChild(span);
        figure.appendChild(img);
        modaleGalerie.appendChild(figure);
    });
    //Supression d'un work via la poubelle dans la modale
    const trashcans = document.querySelectorAll("i.fa-trash-can")
   trashcans.forEach(trash => {
    trash.addEventListener("click", ()=> {
       const trashId = trash.id;
        fetch("http://localhost:5678/api/works/" + trashId, {
            method: "DELETE",
            headers: {
                authorization: "Bearer " + token,
            }
        }) 
        .then((response)=> {
            return response.json()
        })
        displayGalerieModale();
        displayWorks();
    })
   });
}
displayGalerieModale();

// récupération du token qu'on stock dans une variable

let token = sessionStorage.getItem("token");

// Affichage du formulaire d'ajout de photo

const displayButton = document.querySelector(".modale_container button")
const formulaireCtn = document.querySelector(".modale_container--formulaire")
const arrowBack = document.querySelector(".fa-arrow-left")

function displayForm(){
    displayButton.addEventListener("click", ()=> {
        modaleContainer.style.display = "none";
        formulaireCtn.style.display = "flex";
    })
}
displayForm();

function clickBack(){
    arrowBack.addEventListener("click", ()=> {
        modaleContainer.style.display = "flex";
        formulaireCtn.style.display = "none";
    })
}
clickBack();

// Prévisualisation de la photo dans le formulaire d'ajout

const imgContainer = document.querySelector(".background")
const imgPreview = document.querySelector(".background img")
const imgInputFile = document.querySelector(".formulaire input")
const imgLabelFile = document.querySelector(".formulaire label")

imgInputFile.addEventListener("change", ()=> {
    const file = imgInputFile.files[0]
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event){
            imgPreview.src = event.target.result
            imgPreview.style.display = "flex";
            imgLabelFile.style.display = "none";
        }
        reader.readAsDataURL(file);
    }
})

// Récuperation des catégories de photo pour le formulaire depuis l'API

async function categoryFormModal() {
const select = document.querySelector("#categorie")
const category = await getCategorie();
category.forEach(category => {
    const option = document.createElement("option");
    option.value = category.id
    option.textContent = category.name
    select.appendChild(option)
});
}
categoryFormModal();


// Envoie des données du formulaire

const form = document.querySelector(".formulaire form")
const formCorrect = document.getElementById("Valider")

form.addEventListener('submit', function(event) {
    event.preventDefault();
    let formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('category', document.getElementById('categorie').value);
    formData.append('image', document.getElementById('file').files[0]);
    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            authorization: "Bearer " + token,
        },
        body: formData
    })
})

// Condition d'activation du bouton de validation SI le formulaire est correctement remplis

form.addEventListener('input', () => {
    if (title.value !=="" && file.value !=="") {
        formCorrect.classList.add("form-correct");
        formCorrect.disabled = false;
    }
    else {
        formCorrect.classList.remove("form-correct");
        formCorrect.disabled = true;
    }
})   
