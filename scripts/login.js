url = "https://ctd-todo-api.herokuapp.com/v1";

let hasSmall = false;
isUserSignIn();
window.addEventListener('load', function(){
    /* -------------------------------------------------------------------------- */
    /* -------------------------------------------------------------------------- */
    /*                              logica del login                              */

    const formulario =  this.document.forms[0];
    const inputEmail =  this.document.querySelector('#inputEmail');
    const inputPassword = this.document.querySelector('#inputPassword');
    
    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    inputEmail.addEventListener('keyup', function(e){
        if (!validateEmail(this.value)) {
            this.className = 'error';
        } else {
            this.className = '';
        }
    });
    inputPassword.addEventListener('keyup', function(e){
        if (this.value.length < 6) {
            this.className = 'error';
        } else {
            this.className = '';
        }
    });


    formulario.addEventListener('submit', function(event){
        event.preventDefault();
        email = inputEmail.value;
        password = inputPassword.value;
        if (inputEmail.className === 'error' || inputPassword.className === 'error') {
            alert('Por favor, verifique que los datos sean correctos');
            return;
        }



        fetch(url + '/users/login', {
            method: 'POST', 
            body: JSON.stringify({email: email, password: password}), 
            headers: {'Content-Type': 'application/json'}})
        .then(response => response.json())
        .then(data => {
            if (data.jwt) {
                localStorage.setItem("token", data.jwt);
                window.location.href = "./mis-tareas.html";
            }
            else {
                document.querySelector(".error").classList.remove("oculto");
            }
        })
        .catch(error => console.error('Error:', error));
    });
});

function isUserSignIn() {
    if (!localStorage.getItem("token")) return;
    fetch(url + '/users/getMe', {headers: {'Authorization': localStorage.getItem("token")}})
    .then(response => response.json())
    .then(data => {
        if (data.id) window.location.href = "./mis-tareas.html"

    })
    .catch(error => console.error('Error:', error));
}