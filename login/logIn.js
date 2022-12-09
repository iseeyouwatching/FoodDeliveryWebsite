import changeNavbar from '/navbar/navbar_changing.js'
import URL from '/helpers/url.js'

$('#form-log-in').submit(handleFormSubmit)

$(document).ready(function () {
    changeNavbar()
})

function handleFormSubmit(event) {
    event.preventDefault()
    const data = serializeForm()
    sendData(data)
}

function serializeForm() {
    let email = $('#user-email').val()
    let password = $('#user-password').val()
    let data = {
        'email' : email,
        'password' : password
    }
    return data
}

function sendData(data) {
    fetch(`${URL}/api/account/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            if (!response.ok) {
                errorLogIn()
            } else {
                return response.json()
            }
        })
        .then((json) => {
            localStorage.setItem('token', `${json['token']}`)
            location.href = '/index.html'
        })
}

function errorLogIn() {
    $('.wrong-email-and-password').text('Вы ввели неверные данные')
}
