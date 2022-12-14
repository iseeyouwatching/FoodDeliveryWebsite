import changeNavbar from "../navbar/navbar_changing.js";
import {dateConvert} from "../helpers/base_functions.js";
import {getDeliveryTime} from "../helpers/base_functions.js";
import URL from "../helpers/url.js";


$(document).ready(function () {
    fetch(`${URL}/api/account/profile`, {
        headers: new Headers ({
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        })
    })
        .then((response) => {
            if (response.ok) {
                changeNavbar("orders");
                getOrders();
                goToCheckout();
            }
            else {
                localStorage.removeItem('token')
                location.href = '/login/index.html'
            }
        })
})

function getOrders() {
    checkBasket();
    $("#history-container").empty();
    fetch(`${URL}/api/order`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            for (let order of json) {
                console.log(order);
                let block = $("#order_history_card").clone();
                block.attr('id', order.id);
                block.find('.order_data').text(dateConvert(order['orderTime'].substr(0, 10)));
                block.find('.delivery_data').text(getDeliveryTime(order['deliveryTime']));
                block.find('.order_status').text(statusConvert(order['status'], block));
                block.find('.delivery_price').text(order['price']);
                $("#history-container").append(block);
                block.removeClass('d-none');
            }

            confirmDelivery();
        })
        .catch((error) => {
            console.log(error);
        })
}

function goToCheckout() {
    $(".orders_formalize").on('click', function () {
        window.location.href = "/purchase/index.html";
    })
}

function checkBasket() {
    fetch(`${URL}/api/basket`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            console.log(json.length);
            if (json.length === 0) {
                $("#note").addClass("d-none");
            } else {
                $("#note").removeClass("d-none");
            }

        })
        .catch((error) => {
            console.log(error);
        })
}

function statusConvert(string, block) {
    if (string === 'Delivered') {
        $(".confirm_order").addClass('d-none')
        return 'Доставлен'
    } else if (string === 'InProcess') {
        block.find(".confirm_order").removeClass('d-none');
        return 'В процессе'
    }
}

function confirmDelivery() {
    $(".confirm_order").on('click', function () {
        let id = $(this).parent().parent().parent().parent().parent().parent().attr('id');

        fetch(`${URL}/api/order/${id}/status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then((response) => {
             console.log('ура')
            })
        $(this).addClass('d-none');
    })

}