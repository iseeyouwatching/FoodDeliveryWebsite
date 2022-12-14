import URL from "../helpers/url.js";
import changeNavbar from "../navbar/navbar_changing.js";

$(document).ready(function () {
    fetch(`${URL}/api/account/profile`, {
        headers: new Headers ({
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        })
    })
        .then((response) => {
            if (response.ok) {
                changeNavbar()
                getData();
                $("#submit_order").on('click', function () {
                    const data = serializeForm();
                    sendData(data);
                })
            }
            else {
                localStorage.removeItem('token')
                location.href = '/login/index.html'
            }
        })
})

function serializeForm() {
    let date = $('#delivery-time').val();
    let address = $('#address').val();

    let data = {
        'address': address,
        'deliveryTime': date
    }

    if (date !== '') {
        data.deliveryTime = date + ':00.000Z'
    }

    return data;
}

function sendData(data) {
    fetch(`${URL}/api/order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(data)
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json();
            }
        })
        .then((json) => {
            console.log(json);
        })
        .catch(json => {
            return json;
        })
}

function getData() {
    fetch(`${URL}/api/account/profile`, {
        headers: new Headers({
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        })
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
        })
        .then((json) => {
            console.log(json['email']);
            $('#email').val(json['email']);
            $('#phone').val(`${json['phoneNumber']}`);
        })
        .catch(() => {
            localStorage.removeItem('token')
        })
}