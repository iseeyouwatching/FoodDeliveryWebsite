import URL from '/helpers/url.js'

function LoadDetails() {
    fetch(`${URL}/api/account/profile`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then((response) => {
            return response.json()
        })
        .then((json) => {
            $('.form-edit-profile').attr('id', json['id'])
            $('.user-fullname').val(json['fullName'])
            $('.user-email').val(json['email'])
            $('.user-birthdate').val(json['birthDate'].substr(0, 10))
            if (json['gender'] === "Female") {
                $('.user-gender').val("женщина")
            }
            else {
                $('.user-gender').val("мужчина")
            }
            $('.user-address').val(json['address'])
            $('.user-phone-number').val(json['phoneNumber'])
        })
}

export default LoadDetails