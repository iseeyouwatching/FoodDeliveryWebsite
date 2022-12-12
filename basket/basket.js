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
                loadBasketDetails()
            }
            else {
                localStorage.removeItem('token')
                location.href = '/login/index.html'
            }
        })
});

async function loadBasketDetails()
{
    $("#basket-list").empty();

    await fetch(`${URL}/api/basket`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            if (!json.length) {
                $(".basket-card").addClass("d-none")
            }
            let template = $('.basket-template')
            for (let dish of json)
            {
                let block = template.clone();
                block.removeClass("d-none");
                block.attr("basket_main_id", dish.id);
                block.find(".button-delete").attr("basket_id", dish.id);
                block.find(".button-minus-basket").attr("basket_id", dish.id);
                block.find(".button-plus-basket").attr("basket_id", dish.id);
                block.find(".img-basket").attr("src", dish.image);
                block.find(".img-basket").attr("basket_id", dish.id);
                block.find(".basket-name").text(dish.name);
                block.find(".basket-price").text(dish.price + " руб.");
                block.find(".item-count-basket").text(dish.amount);
                $('#basket-list').append(block);
            }
        })
        .catch((error) => {
            console.log(error)
        })

    changeAmount()
    fullDelete()
    await dishDetails()
}

async function dishDetails() {

    $(".img-basket").on('click', function () {
        let id = $(this).attr("basket_id");
        location.href = '/item/index.html#' + id
    })
}

function changeAmount()
{
    $(".button-minus-basket").on('click', function(e) {
        let id = $(this).attr("basket_id")
        deleteFromBasket(id, '?increase=true')
    })

    $(".button-plus-basket").on('click', function(e) {
        let id = $(this).attr("basket_id")
        addToBasket(id)
    })
}

function fullDelete()
{
    $('.button-delete').on('click', function(e) {
        console.log("test")
        let id = $(this).attr("basket_id");
        deleteFromBasket(id, '?increase=false');
    })
}

async function addToBasket(id)
{

    await fetch(`${URL}/api/basket/dish/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .catch((error) => { console.log(error); })

    $("li[basket_main_id=" + id + "]").each(function() {
        let count = $(this).find(".item-count-basket").text();
        $(this).find(".item-count-basket").text(parseInt(count) + 1);
        console.log($(this).find(".item-count-basket").text());
    })
}

async function deleteFromBasket(id, params)
{

    await fetch(`${URL}/api/basket/dish/${id}` + params, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .catch((error) => { console.log(error); })

    $("li[basket_main_id=" + id + "]").each(function() {
        let count = $(this).find(".item-count-basket").text();
        if (count == 1 || params == '?increase=false') $(this).addClass("d-none");
        $(this).find(".item-count-basket").text(parseInt(count) - 1);
        console.log($(this).find(".item-count-basket").text());
    })
}
