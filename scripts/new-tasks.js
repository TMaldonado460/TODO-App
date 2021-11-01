let GROUPS = {};
window.addEventListener("load", main)



async function main() {
    signIn()
    signOff()
    await loadTasks()
    console.log(GROUPS)
    drawTasks()
    document.querySelector(".add-group").addEventListener("click", function(e){
        moveRight(true)
    })
    document.querySelector("ul .plus").addEventListener("click", function(e){
        addNewTask()
    })

}

function addNewTask(data = null, completed = false) {
    data || ( data = document.querySelector("input").value )
    console.log(data)
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
        GROUPS = {}
        return loadTasks()
        
    })
    .then(data => {
        drawTasks()
    })
}

function moveRight(isAdding = false) {
    if ( isAdding ) {
        const main = document.querySelector("h1")
        if ( main.innerHTML == "Add Group Name" ) return
        const right = document.querySelector(".right")
        right.innerHTML = "<h2>Archives</h2>"
        document.querySelector(".left").innerHTML = LEFT_ADD_GROUP
        for ( group in GROUPS ) {
            const h2 = document.createElement("h2")
            h2.innerText = group
            right.insertBefore(h2, right.lastChild)
        }
        main.innerText = "Add Group Name"
        main.contentEditable = true
        setCaret(main)
        document.querySelector("ul").innerHTML = PARENT_TEMPLATE
    }
}

function loadTasks() {
    return fetch(url + '/tasks', {method: "GET", headers: {'Authorization': localStorage.getItem("token")}})
    .then(response => response.json())
    .then(data => {
        for (task of data) {
            const taskData = JSON.parse(task.description);
            taskData.id = task.id
            taskData.completed = task.completed
            const group = taskData.group
            if ( !GROUPS[group] ) {
                GROUPS[group] = []
            }
            GROUPS[group].push(taskData)
        }
    })
}

function drawTasks(key = null) {
    const h1 = document.querySelector("h1");
    ( key in GROUPS ) ? group = key : group = Object.keys(GROUPS)[0];
    const ul = document.querySelector("ul")
    h1.innerText = group
    ul.innerHTML = ""
    for (task of GROUPS[group]) {
        const li = createLi(task.description, task.completed, task.id)
        ul.appendChild(li)
    }
    ul.innerHTML += PARENT_TEMPLATE
    let isRight = false
    const left = document.querySelector(".left")
    const right = document.querySelector(".right")
    right.innerHTML = "<h2>Archives</h2>"
    left.innerHTML = LEFT_ADD_GROUP
    left.querySelector(".add-group").addEventListener("click", function(e){
        moveRight(true)
    })
    for ( grupo in GROUPS ) {
        if (grupo == group) {
            isRight = true
            continue
        }
        const h2 = document.createElement("h2")
        h2.innerText = grupo
        h2.onclick = function() {
            drawTasks(h2.innerHTML)
        }

        if ( isRight ) {
            right.insertBefore(h2, right.lastChild)
        } else {
            left.appendChild(h2)
        }
        
    }
    removeEdition()
}

function signOff() {
    document.querySelector("#closeApp").addEventListener("click", () => {
        localStorage.removeItem("token")
        location.href = "./index.html"
    })
}
function removeEdition() {
    document.querySelector("h1").contentEditable = false
}