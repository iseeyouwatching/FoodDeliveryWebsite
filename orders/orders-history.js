import changeNavbar from "../navbar/navbar_changing.js";
import {dateConvert, getDeliveryTime2} from "../helpers/base_functions.js";
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


$(document).on('click', ".confirm-delivery", function() {
    let id = $(this).attr("order_details_id");
    confirmDelivery(id);
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
                block.find('.order-time').attr("id", order.id);
                block.find(".confirm-delivery").attr("order_details_id", order.id);
                block.find('.confirm-delivery').on('click', function () {
                    let id = $(this).attr("id");
                    location.href = '/order/index.html#' + id
                })
                block.find('.order-time').on('click', function () {
                    let id = $(this).attr("id");
                    location.href = '/order/index.html#' + id
                })
                if(statusConvert(order['status'], block).time === true){
                    block.find('.delivery_data').text(getDeliveryTime(order['deliveryTime']));
                }
                else{
                    block.find('.delivery_data').text(getDeliveryTime2(order['deliveryTime']));
                }
                block.find('.order_status').text(statusConvert(order['status'], block).delivery_status);
                block.find('.delivery_price').text(order['price']);
                block.find('.delivery_text').text(statusConvert(order['status'], block).delivery_text);
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
    let text = {}

    if (string === 'Delivered') {
        block.find(".confirm_order").addClass('d-none')
        text.delivery_text = 'Доставлен:'
        text.delivery_status = 'Доставлен'
        text.time = true;

    } else if (string === 'InProcess') {
        block.find(".confirm_order").removeClass('d-none');
        text.delivery_text = 'Доставка ожидается '
        text.delivery_status = 'В обработке'
        text.time = false;
    }
    return text;
}

function confirmDelivery() {
    $(".confirm_order").on('click', function () {
        let block = $(this).parent().parent().parent().parent().parent().parent();
        let id = block.attr('id');

        fetch(`${URL}/api/order/${id}/status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                    $(this).addClass('d-none');
                    block.find('.order_status').text('Доставлено:');
                    let data = block.find('.delivery_data').val();
                    console.log(data);
                    block.find('.delivery_data').val(data.substr(0,5));
                }
                else {
                    console.log('error')
                }

            })
    })

}