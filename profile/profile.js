import changeNavbar from '/navbar/navbar_changing.js'
import LoadDetails from '/profile/load_profile_details.js'
import URL from '/helpers/url.js'
import isValid from "/profile/validationForUpdate.js";

$(document).ready(function () {
    fetch(`${URL}/api/account/profile`, {
        headers: new Headers({
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        })
    })
        .then((response) => {
            if (response.ok) {
                changeNavbar()
                LoadDetails()
            }
            else {
                localStorage.removeItem('token')
                location.href = '/login/index.html'
            }
        })
})

$('.edit-profile-btn').click(function (e) {
    e.preventDefault()
    if (isValid()) {
        const data = serializeForm()
        sendData(data)
    }
})


function serializeForm() {
    let fullName = $('.user-fullname').val()
    let birthDate = $('.user-birthdate').val()
    let gender = $('.user-gender').val()
    let address = $('.user-address').val()
    let phoneNumber = $('.user-phone-number').val()

    let data = {
        'fullName': fullName,
        'address': address,
        'phoneNumber': phoneNumber,
    }

    if (birthDate !== '') {
        data.birthDate = birthDate + 'T00:00:00.000Z'
    }

    if (gender === "женщина") {
        data.gender = "Female"
    }
    else {
        data.gender = "Male"
    }

    return data
}

function sendData(data) {
    fetch(`${URL}/api/account/profile`, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            if (response.ok) {
                $('.edit-profile-btn').removeClass('is-invalid')
                return response
            } else {
                $('.edit-profile-btn').toggleClass('is-invalid', true)
            }
        })
        .then(() => {
            LoadDetails()
        })
}
