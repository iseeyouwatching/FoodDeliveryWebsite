import changeNavbar from '/navbar/navbar_changing.js'
import URL from '/helpers/url.js'

$('#form-log-in').submit(handleFormSubmit)

$(document).ready(function () {
    changeNavbar()
})

function handleFormSubmit(event) {
    event.preventDefault()
    if (isValidLogIn()) {
        const data = serializeForm()
        sendData(data)
        $('.input-log-in').removeClass('is-invalid')
    }
}

const EMAIL_REGEXP = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
function isEmailValid(value) {
    return EMAIL_REGEXP.test(value)
}

function isValidLogIn() {
    let email = $('#user-email').val()
    if (!isEmailValid(email)) {
        errorLogIn()
        return false
    }
    return true
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
    $('.input-log-in').addClass('is-invalid')
    $('.invalid-feedback').text('Вы ввели неверные данные')
}
