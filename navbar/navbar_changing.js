import URL from '../helpers/url.js'
import overallAmount from "../basket/overall_amount.js";

function changeNavbar(activePage) {
    $("#food-delivery-navbar").load("/navbar/navbar.html");
    $("#food-delivery-footer").load("/footer/footer.html");
    fetch(`${URL}/api/account/profile`, {
        headers: new Headers({
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        })
    })
        .then((response) => {
            if (response.ok) {
                return response.json()
            }
            else {
                throw Error(response.status.toString())
            }
        })
        .then((json) => {
            overallAmount()
            $('.unauthorized-section').addClass('d-none')
            $('.authorized-section').removeClass('d-none')
            $('.email a').text(`${json['email']}`);
            $(`#${activePage}`).addClass('active')
        })
        .catch(error => {
            localStorage.removeItem('token')
            $('.authorized-section').addClass('d-none')
            $('.unauthorized-section').removeClass('d-none')
            $(`#${activePage}`).addClass('active')
        })
}

export default changeNavbar;