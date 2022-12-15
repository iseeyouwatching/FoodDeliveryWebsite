import URL from "../helpers/url.js";
import changeNavbar from "../navbar/navbar_changing.js";

$(document).ready(function() {
    fetch(`${URL}/api/account/profile`, {
        headers: new Headers ({
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        })
    })
        .then((response) => {
            if (response.ok) {
                changeNavbar("cart")
                getCustomer();
                getPurchaseList();
                $(".confirm-orders").on('click', async function() {
                    if (isValid()) {
                        confirmOrder();
                        window.location.href="/orders/index.html"
                    }
                })
            }
            else {
                localStorage.removeItem('token')
                location.href = '/login/index.html'
            }
        })
})

function getCustomer()
{
    let token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${URL}/api/account/profile`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then((response) => {
            if (response.status === 401) {
                localStorage.removeItem("token");
            }
            return response.json();
        })
        .then((json) => {
            $("#customer-phone").val(json.phoneNumber);
            $("#customer-email").val(json.email);
            $("#customer-address").val(json.address);
        })
        .catch((error) => {
            console.log(error);
        })
}

function isValid()
{

    let address = $("#customer-address").val().trim();
    $("#customer-address").val(address);
    if (!String(address).length) {
        $('#customer-address').toggleClass('is-invalid', true)
        $('#customer-address+.invalid-feedback').text('Данное поле должно быть заполнено')
        return false;
    }
    else {
        $('#customer-address').removeClass('is-invalid')
    }

    var date = new Date();
    var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split("Z")[0];
    if ($('#customer-time').val() < dateString || !$('#customer-time').val()) {
        $('#customer-time').toggleClass('is-invalid', true)
        $('#customer-time+.invalid-feedback').text('Некорректное время доставки')
        return false
    }
    else {
        $('#customer-time').removeClass('is-invalid')
    }

    return true;
}

function getPurchaseList()
{
    let token = localStorage.getItem("token");
    if (!token) return;

    $("#purchase-list").empty();

    fetch(`${URL}/api/basket`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then((response) => {
            if (response.status === 401) {
                localStorage.removeItem("token");
            }
            return response.json();
        })
        .then((json) => {
            if (!json.length) {
                $(".purchase-card").addClass("d-none");
            }
            let template = $(".purchase-template");
            let finalPrice = 0;
            for (let dish of json)
            {
                let block = template.clone();
                block.attr("purchase_main_id", dish.id);
                block.find(".img-purchase").attr("src", dish.image);
                block.find(".purchase-name").text(dish.name);
                block.find(".purchase-price").text(dish.price + " руб.");
                block.find(".purchase-amount").text(dish.amount + " шт.");
                block.find(".purchase-totalprice").text(dish.totalPrice + " руб.");
                finalPrice += dish.totalPrice;
                block.removeClass("d-none");
                $("#purchase-list").append(block);
            }
            $(".purchase-finalprice").text(finalPrice);
        })
        .catch((error) => {
            console.log(error);
        })
}

function confirmOrder()
{
    let token = localStorage.getItem("token");
    if (!token) return;

    let deliveryTime = $('#customer-time').val();
    let address = $('#customer-address').val();

    fetch(`${URL}/api/order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
            "deliveryTime": deliveryTime,
            "address": address
        }),
    })
        .then((response) => {
            if (response.status === 401) {
                localStorage.removeItem("token");
            }
            if (response.ok) {
                getBasketIds();
            }

        })
        .catch((error) => {
            console.log(error);
        })
}

function getBasketIds()
{
    let token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${URL}/api/basket`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then((response) => {
            if (response.status === 401) {
                localStorage.removeItem("token");
            }
            return response.json();
        })
        .then((json) => {
            for (let dish of json)
            {
                clearBasket(dish.id)
            }
        })
        .catch((error) => {
            console.log(error);
        })
}

function clearBasket(id)
{
    let token = localStorage.getItem("token");
    if (!token) return;
    console.log("delete");
    fetch(`${URL}/api/basket/dish/${id}?increase=false`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .catch((error) => { console.log(error); })
}