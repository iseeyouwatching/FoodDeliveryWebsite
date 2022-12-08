import URL from '../helpers/url.js'

function changeNavbar(activePage) {
    $('#food-delivery-navbar').load('/navbar/navbar.html');
    fetch(`${URL}/api/account/profile`, {
        headers: new Headers({
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        })
    })
        .then((response) => {
            if (response.ok) {
                return response.json()
            }
        })
        .then((json) => {
            $('.unauthorized-section').addClass('d-none')
            $('.authorized-section').removeClass('d-none')
            $('.email a').text(`${json['email']}`);
            $(`#${activePage}`).addClass('active')
        })
        .catch(() => {
            localStorage.removeItem('token')
            $('.authorized-section').addClass('d-none')
            $('.unauthorized-section').removeClass('d-none')
            $(`#${activePage}`).addClass('active')
        })
}

export default changeNavbar;