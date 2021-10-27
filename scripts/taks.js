const url = "https://ctd-todo-api.herokuapp.com/v1"


function deleteTask(id) {
    fetch(url + '/tasks/' + id, {
        method: 'DELETE',
        path: id,
        headers: {
            'authorization': localStorage.getItem('token'),
            'Referrer-Policy': 'origin'
        }
    })
    .then(response => {
        if (response.status == 200) {
            document.querySelector(`#t${id}`).remove()
        }
    })
}
function ocultarTareas() {
    document.querySelector(".tareas-terminadas").parentElement.classList.toggle("ocultar")
}
function completeTask(id) {
    fetch(url + '/tasks/' + id, {
        method: 'PUT',
        path: id,
        headers: {
            'authorization': localStorage.getItem('token'),
            'Content-Type': 'application/json',
            'Referrer-Policy': 'origin'
        },
        body: JSON.stringify({
            description: document.querySelector(`#t${id} .nombre`).innerHTML,
            completed: true
        })
    })
    .then(response => {
        return response.json()
    })
    .then(data => {
        if (data.id) {
            document.querySelector(`#t${id}`).remove()
            createTask(data)
        }
    })
}
function createTask(task) {
    let li = document.createElement("li")
    li.className = "tarea"
    li.id = `t${task.id}`
    li.innerHTML = `<div class="${task.completed ? "done": "not-done"}" onclick="completeTask(${task.id})"></div>
    <div class="descripcion">
      <p class="nombre">${task.description}</p>
      <p class="timestamp">Creada el ${task.createdAt.slice(0,10)} a las ${task.createdAt.slice(12, 19)}</p>
      <button class="delete" onclick="deleteTask(${task.id})"><i class="fas fa-trash-alt"></i></button>
    </div>`
    if (task.completed) document.querySelector(".tareas-terminadas").appendChild(li)
    else{
        document.querySelector(".tareas-pendientes").appendChild(li)
    }
}
signIn()
window.addEventListener("load", function() {
    

    fetch(url + '/tasks', {method: "GET", headers: {'Authorization': localStorage.getItem("token")}})
    .then(response => response.json())
    .then(data => {
        this.document.getElementById("skeleton").innerHTML = ""
        data.forEach(task => {
            createTask(task)
        })
    })
    .catch(error => {
        console.log(error)
    })
    
    form = document.querySelector("form.nueva-tarea")
    form.addEventListener("submit", function(event) {
        event.preventDefault()
        if (form.querySelector("input").value.length == 0) return
        let task = {
            description: this.querySelector("input").value,
        }
        fetch(url + '/tasks', {
            method: "POST", 
            headers: {
                'Authorization': localStorage.getItem("token"),
                'Content-Type': 'application/json',
                'Referrer-Policy': 'origin'               
            }, 
            body: JSON.stringify(task)})
        .then(response => response.json())
        .then(data => {
            createTask(data)
        })
        event.target.reset()
    })
    const closeApp = this.document.querySelector("#closeApp")
    closeApp.addEventListener("click", () => {
        localStorage.removeItem("token")
        location.href = "./index.html"
    })
})

function signIn() {
    fetch(url + '/users/getMe', {headers: {'Authorization': localStorage.getItem("token")}})
    .then(response => response.json())
    .then(data => {
        if (!data.id) {
            location.href = "./index.html"
        }
        document.querySelector(".user-info p").innerHTML = data.firstName + " " + data.lastName
    })
    .catch(error => {
        window.location.href = "./index.html"
    });
}
