// https://6575814bb2fbb8f6509d2b14.mockapi.io/task-manager/users

const form = document.querySelector(".form")
const emailInp = document.querySelector(".email")
const nameInp = document.querySelector(".name")
const passwordInp = document.querySelector(".password")
const passwordConfirmInp = document.querySelector(".passwordConfirm")
const submit = document.querySelector(".submit")
const error = document.querySelector(".error")

const uid = JSON.parse(localStorage.getItem("user"))?.id

// Redirecting to todolist page if logged in
if (uid) {
    window.location.replace("../pages/todoListPage.html")
}

// Registering a user

const register = async (name, email, password) => {
    try {
        const response = await fetch("https://6575814bb2fbb8f6509d2b14.mockapi.io/task-manager/users", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                name, email, password
            })
        })
        if (response.status >= 200 && response.status <= 250) {
            window.location.replace("../../index.html")
        }
    } catch (e) {
        console.log(e)
    }
}

// Submitting the register form

form.onsubmit = (e) => {
    e.preventDefault()
    if (passwordInp.value === passwordConfirmInp.value) {
        register(nameInp.value, emailInp.value, passwordInp.value).then()
    } else {
        error.innerHTML = "Passwords are not correct!"
    }
}

// Remove error
form.oninput = () => {
    error.innerHTML = ""
}