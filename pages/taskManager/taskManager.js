const logout = document.querySelector(".logout")
const tasks = document.querySelector(".bottom")
const newTask = document.querySelector(".newTask")
const newSubmit = document.querySelector(".newSubmit")

const uid = JSON.parse(localStorage.getItem("user"))

// Logout

logout.onclick = () => {
    localStorage.removeItem("user");
    window.location.replace("../../index.html")
}

// Request to get all tasks by the user id
const getTasks = async () => {
    try {
        const response = await fetch(`https://6575814bb2fbb8f6509d2b14.mockapi.io/task-manager/users/${uid}/tasks`)
        const data = await response.json()

        // Client side error handler
        if (response.status >= 400 && response.status <= 450) {
            return "error"
        }
        if (data) {
            return data
        }

    } catch (e) {
        return "error"
    }
}

// Create tags by the tasks
const createTags = (task) => {

    // Create the main block for all elements
    const div = document.createElement("div")
    div.classList.add("task")

    // Block for the checkbox and p tags
    const taskInfo = document.createElement("div")
    taskInfo.classList.add("taskInfo")

    // Create checkbox and call function
    const checkbox = document.createElement("input")
    checkbox.setAttribute("type", "checkbox")
    checkbox.classList.add("taskCheckbox")
    checkbox.checked = task.completed
    checkbox.onclick = async (e) => {
        await check(task.id, e.target.checked)
    }

    // Text
    const text = document.createElement("p")
    text.classList.add("taskText")
    text.innerHTML = task.text

    // Block for editing the task
    const editText = document.createElement("div")
    editText.classList.add("editText", "hide")

    // Input for a new text
    const newText = document.createElement("input")
    newText.classList.add("newText")
    newText.placeholder = "New task"
    newText.oninput = () => {
        newText.style.borderColor = "black"
    }

    // New text submit button
    const newTextSubmit = document.createElement("button")
    newTextSubmit.classList.add("newTextSubmit")
    newTextSubmit.innerHTML = "submit"

    // Block for the buttons
    const taskButtons = document.createElement("div")
    taskButtons.classList.add("taskButtons")

    // Edit button. The input turns red and won't be submitted if it is empty
    const editBtn = document.createElement("button")
    editBtn.classList.add("taskEdit")
    editBtn.innerHTML = "EDIT"
    editBtn.onclick = async () => {
        editText.classList.remove("hide")
        newTextSubmit.onclick = async () => {
            if (newText.value !== "") {
                const editedTask = await edit(task.id, newText.value)
                text.innerHTML = editedTask.text
                newText.value = ""
                editText.classList.add("hide")
            } else {
                newText.style.borderColor = "red"
            }
        }
    }

    // Delete button
    const deleteBtn = document.createElement("button")
    deleteBtn.classList.add("taskDelete")
    deleteBtn.innerHTML = "DELETE"
    deleteBtn.onclick = async () => {
        await deleteTask(task.id)
        await div.remove()
    }

    // Appending the elements into the corresponding blocks
    taskInfo.append(checkbox, text)
    editText.append(newText, newTextSubmit)
    taskButtons.append(editBtn, deleteBtn)
    div.append(taskInfo, taskButtons, editText)
    tasks.insertBefore(div, tasks.firstChild)
}

// Show the tasks in the task manager
const showTasks = async () => {
    const tasks = await getTasks()
    if (tasks) {
        tasks.forEach(task => {
            createTags(task)
        })
    } else if (tasks === "error") {
        console.log("Error!")
    }
}

showTasks()

// Delete task function
const deleteTask = async (id) => {
    try {
        await fetch(`https://6575814bb2fbb8f6509d2b14.mockapi.io/task-manager/users/${uid}/tasks/${id}`, {method: "DELETE"})
    } catch (e) {
        console.log(e)
    }

}

// Check task function
const check = async (id, check) => {
    try {
        await fetch(`https://6575814bb2fbb8f6509d2b14.mockapi.io/task-manager/users/${uid}/tasks/${id}`, {
            method: "PUT",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({completed: check})
        })
    } catch (e) {
        console.log(e)
    }

}

// Edit task function
const edit = async (id, text) => {
    try {
        const response = await fetch(`https://6575814bb2fbb8f6509d2b14.mockapi.io/task-manager/users/${uid}/tasks/${id}`, {
            method: "PUT",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({text})
        })
        return await response.json()
    } catch (e) {
        console.log(e)
    }
}

// Post a new task
const postNewTask = async (text) => {
    try {
        const response = await fetch(`https://6575814bb2fbb8f6509d2b14.mockapi.io/task-manager/users/${uid}/tasks/`, {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({text, completed: false})
        })
        createTags(await response.json())
    } catch (e) {
        console.log(e)
    }
}

const topError = document.querySelector(".topError")

// Post a new task on click if not empty
newSubmit.onclick = async () => {
    if (newTask.value !== "") {
        await postNewTask(newTask.value)
        newTask.value = ""
    } else {
        topError.innerHTML = "Task is required!"
    }
}

const allBtn = document.querySelector(".allBtn")
const completedBtn = document.querySelector(".completedBtn")
const uncompletedBtn = document.querySelector(".uncompletedBtn")

// Filter tasks function
const filterTasks = async (completed) => {
    try {
        const response = await fetch(`https://6575814bb2fbb8f6509d2b14.mockapi.io/task-manager/users/${uid}/tasks?completed=${completed}`)
        return await response.json()
    } catch (e) {
        console.log(e)
    }
}

// Show all tasks
allBtn.onclick = async () => {
    tasks.innerHTML = null
    const filteredTasks = await filterTasks("")
    await filteredTasks.forEach(task => createTags(task))
}

// Show completed tasks
completedBtn.onclick = async () => {
    tasks.innerHTML = null
    const filteredTasks = await filterTasks("true")
    await filteredTasks.forEach(task => createTags(task))
}

// Show uncompleted tasks
uncompletedBtn.onclick = async () => {
    tasks.innerHTML = null
    const filteredTasks = await filterTasks("false")
    await filteredTasks.forEach(task => createTags(task))
}