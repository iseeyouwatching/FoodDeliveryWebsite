import URL from '../helpers/url.js'
import overallAmount from "../basket/overall_amount.js";

function changeNavbar() {
    $("#food-delivery-navbar").load("/navbar/navbar.html");
    $("#food-delivery-footer").load("/footer/footer.html");
    overallAmount()
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
            $('.unauthorized-section').addClass('d-none')
            $('.authorized-section').removeClass('d-none')
            $('.email a').text(`${json['email']}`);
        })
        .catch(error => {
            localStorage.removeItem('token')
            $('.authorized-section').addClass('d-none')
            $('.unauthorized-section').removeClass('d-none')
        })
}

export default changeNavbar;