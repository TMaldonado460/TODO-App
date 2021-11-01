const url = "https://ctd-todo-api.herokuapp.com/v1"
const PARENT_TEMPLATE = `<div><div class="plus" onclick="addNewTask()">+</div><input type="text" placeholder="nueva tarea"></div><button class="archivar">archivar</button></div>`
const LEFT_ADD_GROUP = `<div class="add-group"><div class="plus">+</div></div>`



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

function setCaret(el) {
    var range = document.createRange()
    var sel = window.getSelection()

    range.setStart(el.childNodes[0], el.innerHTML.length)
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
        if ( response.status === 200 || response.status === 204 ) {
            console.log("Task deleted")
        }
        else {
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

function addNewTask(data = null, completed = false) {
    data || ( data = document.querySelector("input").value )
    if ( data == "" ) return
    const dataGroup = document.querySelector("h1").innerText
    const task = {description: JSON.stringify({group: dataGroup, description:data}), completed: completed};
    fetch(url + '/tasks', {
        method: "POST", 
        headers: {
            'Authorization': localStorage.getItem("token"),
            'Content-Type': 'application/json',
        }, 
        body: JSON.stringify(task)})
    .then(response => response.json())
    .then(data => {
        return loadTasks()
        
    })
    .then(data => {
        drawTasks(document.querySelector("h1").innerText)
    })
}
