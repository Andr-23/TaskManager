const form = document.querySelector(".form")
const email = document.querySelector(".email")
const password = document.querySelector(".password")
const error = document.querySelector(".error")

const uid = JSON.parse(localStorage.getItem("user"))

// Go to the task manager
if (uid) {
    window.location.replace("pages/taskManager/taskManager.html")
}

// Log in
const getUsers = async () => {
    try {
        const response = await fetch("https://6575814bb2fbb8f6509d2b14.mockapi.io/task-manager/users")
        const users = await response.json()
        return users.find(item => item.email === email.value && item.password === password.value)

    } catch (e) {
        console.log(e)
    }
}

// Submit the login form

form.onsubmit = async (e) => {
    e.preventDefault()
    const user = await getUsers()
    if (user) {
        localStorage.setItem("user", JSON.stringify(user.id))
        window.location.replace("pages/taskManager/taskManager.html")
    } else {
        error.innerHTML = "Invalid login or password!"
    }
}

// Erase the message
form.oninput = () => {
    error.innerHTML = ""
}