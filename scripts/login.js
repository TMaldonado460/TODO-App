url = "https://ctd-todo-api.herokuapp.com/v1";

let hasSmall = false;
isUserSignIn();
window.addEventListener('load', function(){
    /* -------------------------------------------------------------------------- */
    /* -------------------------------------------------------------------------- */
    /*                              logica del login                              */
    loadDouble();

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

function loadDouble() {
    fetch("./signup.html")
    .then(response => {
        return response.text();
    })
    .then(data => {
        html = document.createElement("html");
        html.innerHTML = data;
    left = html.querySelector(".left img");
    right = html.querySelector(".right div");
    div = document.createElement("div");
    div.appendChild(left);
    document.querySelector(".right").insertBefore(div, document.querySelector(".right").firstChild);
    document.querySelector(".left").appendChild(right);
})
.then(() => {
    document.querySelectorAll("a").forEach(function(e){
        console.log(e);
        e.addEventListener("click", swich);
    });
})
.then(loadSignIn)
}

function swich(e) {
    e.preventDefault();
    const left = document.querySelector(".left")
    const right = document.querySelector(".right")
    const lTop = parseInt(left.style.top);
    const rTop = parseInt(right.style.top);
    console.log(lTop, rTop);
    if (lTop) {
        left.style.top = "0px";
    } else {
        left.style.top = "-100vh";
    }
    if (rTop) {
        right.style.top = "0px";
    }
    else {
        right.style.top = "-100vh";
    }
    return false;
}

