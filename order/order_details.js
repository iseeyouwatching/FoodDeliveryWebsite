import changeNavbar from '../navbar/navbar_changing.js'
import URL from "../helpers/url.js";

$(document).ready(function () {
    fetch(`${URL}/api/account/profile`, {
        headers: new Headers ({
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        })
    })
        .then((response) => {
            if (response.ok) {
                changeNavbar()
                getOrderData(location.hash.substr(1))
            }
            else {
                localStorage.removeItem('token')
                location.href = '/login/index.html'
            }
        })
});


$(document).on('click', ".confirm-delivery", function() {
    confirmDelivery(location.hash.substr(1));
})

function getOrderData(id)
{
    let token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${URL}/api/order/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then((response) => {
            if (response.status == 401) {
                localStorage.removeItem("token");
                window.location.href="index.html";
            }
            return response.json();
        })
        .then((json) => {
            let date = json.orderTime.split("T")[0].split("-");
            let time = json.orderTime.split("T")[1].slice(0, 5);
            $(".order-date").text("Дата заказа: " + date[2] + "." + date[1] + "." + date[0] + " " + time);

            date = json.deliveryTime.split("T")[0].split("-");
            time = json.deliveryTime.split("T")[1].slice(0, 5);
            $(".order-delivery-date").text("Дата доставки: " + date[2] + "." + date[1] + "." + date[0] + " " + time);
            $(".order-address").text("Адрес доставки: " + json.address);

            let status = "В процессе";
            if (json.status == "Delivered") {
                status = "Доставлен";
                console.log("test")
                $(".confirm-delivery").addClass("d-none");
            };
            $(".order-status").text("Статус заказа - " + status);

            let template = $(".order-template");
            let finalPrice = 0;
            for (let order of json.dishes)
            {
                let block = template.clone();
                block.attr("order_details_id", order.id);
                block.find(".img-order").attr("src", order.image);
                block.find(".order-name").text(order.name);
                block.find(".order-price").text("Цена: " + order.price + " руб.");
                block.find(".order-amount").text("Количество: " + order.amount + " шт.");
                block.find(".price-txt").text("Стоимость: ");
                block.find(".price-txt").addClass("fw-bold");
                block.find(".order-totalprice").text(order.totalPrice + " руб.");
                finalPrice += order.totalPrice;
                block.removeClass("d-none");
                $("#order-list").append(block);
            }
            $(".order-finalprice").text(finalPrice);

        })
        .catch((error) => {
            console.log(error);
        })
}

function confirmDelivery(id) {
    fetch(`${URL}/api/order/${id}/status`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then((response) => {
            if (response.status == 401) {
                localStorage.removeItem("token");
                window.location.href="index.html";
            }
            if (response.ok) {
                window.location.reload();
            }
        })
        .catch((error) => {
            console.log(error);
        })

}