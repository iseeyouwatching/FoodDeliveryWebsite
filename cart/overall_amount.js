import URL from "../helpers/url.js";

export default function overallAmount()
{
    fetch(`${URL}/api/basket`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then((response) => {
            if (response.status === 401) {
                localStorage.removeItem("token")
            }
            return response.json();
        })
        .then((json) => {
            let amount = 0;
            for (let dish of json) amount += dish.amount;
            if (amount > 0) {
                $(".basket-amount").removeClass('text-bg-secondary')
                $(".basket-amount").addClass('text-bg-success')
                $(".basket-amount").text(amount)
            }
        })
        .catch((error) => {
            console.log(error);
        })
}