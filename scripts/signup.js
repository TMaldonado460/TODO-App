console.log('signup.js');
window.onload = () => {
    console.log('signup.js loaded');
    form = document.forms[0];
    inputs = form.querySelectorAll('input');


    inputs[0].onkeyup = function () {
        if (this.value.length < 2) {
            this.className = 'error';
        } else {
            this.className = '';
        }
    };
    inputs[1].onkeyup = function () {
        if (this.value.length < 2) {
            this.className = 'error';
        } else {
            this.className = '';
        }
    };
    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    inputs[2].onkeyup = function () {
        if (!validateEmail(this.value)) {
            this.className = 'error';
        } else {
            this.className = '';
        }
    };
    inputs[3].onkeyup = function () {
        if (this.value.length < 6) {
            this.className = 'error';
        } else {
            this.className = '';
        }
    };
    inputs[4].onkeyup = function () {
        if (this.value != inputs[3].value) {
            this.className = 'error';
        } else {
            this.className = '';
        }
    };

    function normalize(data) {
        var result = {};
        for (var key in data) {
            if (key == "password-confirm") continue;
            if (key == "password") {
                result[key] = data[key];
                continue;
            }
            result[key] = data[key].toLowerCase();
        }
        return result;
    }
    form.onsubmit = (event) => {
        event.preventDefault();
        for (input of inputs) {
            if (input.className == 'error' || !input.value) {
                console.error('Form is not valid');
                return;
            }
        }
        data = {
            'firstName': inputs[0].value,
            'lastName': inputs[1].value,
            'email': inputs[2].value,
            'password': inputs[3].value,
            'password_confirmation': inputs[4].value
        };
        data = normalize(data);
        url = "https://ctd-todo-api.herokuapp.com/v1"
        console.log(data);
        fetch(`${url}/users`, {
            method: 'POST', 
            body: JSON.stringify(data), 
            headers: {
                'Content-Type': 'application/json'
            }})
            .then(response => {
            console.log(response);
            if (response.status == 201) {
                console.log('Created');
                window.location.href = "./index.html";
            } else {
                console.log('Error');
            }
        });
    }
}