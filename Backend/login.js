// Variables //
const errorMessage = document.querySelector("#connexion p");
const form = document.querySelector("form")

//interaction avec le formulaire
form.addEventListener("submit", (e) => { 
    e.preventDefault(); 
// requête a l'api avec la méthode POST
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: form.email.value,
      password: form.password.value,
    }),
  }).then((response) => { 
    if (response.status !== 200) { 
        errorMessage.textContent= "Erreur dans l’identifiant ou le mot de passe";
        email.classList.add("errorLogin")
        password.classList.add("errorLogin")
    } 
    // Si le status est correcte on stock le token dans le storage, on enregistre le statut 'connecté' de l'utilisateur et on le deplace sur la page d'acceuil
    else {
      response.json().then((data) => {
        sessionStorage.setItem("token", data.token);
        window.sessionStorage.logged = true; 
        window.location.replace("index.html");
      });
    }
  });
});