import changeNavbar from '/navbar/navbar_changing.js'
import isValid from "./validationForRegistration.js";
import URL from '/helpers/url.js'

$(document).ready(function () {
    changeNavbar("registration")
})

$('#form-registration').submit(handleFormSubmit)

function handleFormSubmit(event) {
    event.preventDefault()
    if (isValid()) {
        const data = serializeForm()
        sendData(data)
    }
}

function serializeForm() {
    let fullName = $('#userFullName').val()
    let gender = $('#userGender').val()
    let phoneNumber = $('#userPhoneNumber').val()
    let birthDate = $('#userBirthDate').val()
    let address = $('#address').val()
    let email = $('#userEmail').val()
    let password = $('#userPassword').val()

    let data = {
        'fullName': fullName,
        'password': password,
        'email': email,
        'address': address,
        'gender': gender,
        'phoneNumber': phoneNumber
    }

    if (birthDate !== '') {
        data.birthDate = birthDate + 'T00:00:00.000Z'
    }

    return data
}

function sendData(data) {
    fetch(`${URL}/api/account/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept':'application/json'
        },
        body: JSON.stringify(data),
    })
        .then ((response) => {
            if (response.ok) {
                return response.json()
            } else {
                $('#register').toggleClass('is-invalid', true)
                $('#register+.wrong-email').text('Невозможно зарегистрироваться, возможно email уже занят')
            }
        })
        .then ((json) => {
            localStorage.setItem('token', `${json['token']}`)
            location.href = '../index.html'
        })
}

