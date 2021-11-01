const url = "https://ctd-todo-api.herokuapp.com/v1"

function deleteTask(id) {
    document.querySelector(`#t${id}`).remove()
    fetch(url + '/tasks/' + id, {
        method: 'DELETE',
        path: id,
        headers: {
            'authorization': localStorage.getItem('token'),
            'Referrer-Policy': 'origin'
        }
    })
    .then(response => {
        if (response.status != 200) {
            location.reload()
        }
    })
}
function ocultarTareas() {
    document.querySelector(".tareas-terminadas").parentElement.classList.toggle("ocultar")
}
function completeTask(id) {
    const descripcion = document.querySelector(`#t${id} .nombre`).innerHTML;
    document.querySelector(`#t${id}`).remove();
    fetch(url + '/tasks/' + id, {
        method: 'PUT',
        path: id,
        headers: {
            'authorization': localStorage.getItem('token'),
            'Content-Type': 'application/json',
            'Referrer-Policy': 'origin'
        },
        body: JSON.stringify({
            description: descripcion,
            completed: true
        })
    })
    .then(response => {
        return response.json()
    })
    .then(data => {
        if (data.id) {
            createTask(data)
        }
    })
}
async function getTasks() {
    const response = await fetch(url + '/tasks', {
        method: 'GET',
        headers: {
            'authorization': localStorage.getItem('token'),
            'Referrer-Policy': 'origin'
        }
    })
    const data = await response.json()
    return data
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
window.addEventListener("load", function() {
    return
    fetch(url + '/tasks', {method: "GET", headers: {'Authorization': localStorage.getItem("token")}})
    .then(response => response.json())
    .then(data => {
        this.document.getElementById("skeleton").innerHTML = ""
        data.forEach(task => {
            createTask(task)
        })
        this.document.querySelector(".loading").remove()
    })
    
    form = document.querySelector("form.nueva-tarea")
    form.addEventListener("submit", function(event) {
        event.preventDefault()
        if (form.querySelector("input").value.length == 0) return
        let task = {
            description: this.querySelector("input").value,
        }
        data = {
            completed : false,
            description : task.description,
            createdAt : new Date().toISOString(),
            id : 999999,
        }
        createTask(data)
        fetch(url + '/tasks', {
            method: "POST", 
            headers: {
                'Authorization': localStorage.getItem("token"),
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify(task)})
        .then(response => response.json())
        .then(data => {
            deleteTask(999999)
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
}


function setCaret(el, start, end) {
    var range = document.createRange()
    var sel = window.getSelection()

    range.setStart(el.childNodes[0], 0)
    range.setEnd(el.childNodes[0], el.innerHTML.length)
    range.collapse(false)
    
    sel.removeAllRanges()
    sel.addRange(range)
}
function createLi(description, completed=false, id=null) {
    li = document.createElement("li")
    li.id = `t${id}`
    if ( completed ) li.classList.add("completed")
    li.innerHTML = `<div></div><p>${description}</p><button class="delete"><i class="fas fa-trash-alt"></i></button></li>`
    li.querySelector("button").setAttribute( "onclick", `remove(${id})` )
    li.querySelector("div").setAttribute( "onclick", `complete(${id})` )
    return li
}
function remove(id) {
    document.querySelector(`#t${id}`).remove()
    fetch(url + '/tasks/' + id, {
        method: 'DELETE',
        path: id,
        headers: {
            'authorization': localStorage.getItem('token'),
            'Referrer-Policy': 'origin'
        }
    })
    .then(response => {
        if (response.status != 200) {
            location.reload()
        }
    })
}

function complete(id) {
    document.querySelector(`#t${id}`).classList.toggle("completed")
    const completed = document.querySelector(`#t${id}`).classList.contains("completed")
    const dataGroup = document.querySelector("h1").innerText
    const data = document.querySelector(`#t${id}`).querySelector("p").innerText
    fetch(url + '/tasks/' + id, {
        method: 'PUT',
        path: id,
        headers: {
            'authorization': localStorage.getItem('token'),
            'Content-Type': 'application/json',
            'Referrer-Policy': 'origin'
        },
        body: JSON.stringify({
            description: JSON.stringify({group: dataGroup, description:data}), 
            completed: completed
        })
    })
}

const PARENT_TEMPLATE = `<div><div class="plus" onclick="addNewTask()">+</div><input type="text" placeholder="nueva tarea"></div><button class="archivar">archivar</button></div>`
const LEFT_ADD_GROUP = `<div class="add-group"><div class="plus">+</div></div>`