import changeNavbar from '../navbar/navbar_changing.js'
import get_request_string from '/dish_menu/get_request_string.js';
import {convertCategoryEngToRus} from "./converter.js";
import {menuStarRatingOptions} from "/helpers/config.js";
import URL from "../helpers/url.js";

$(document).ready(() => {
    changeNavbar('menu')
    $('.selectpicker').selectpicker();
    $('#btn-execute').on('click', handleForSubmit);
    handleForSubmit();
});

function handleForSubmit(event) {
    $('#card_container').empty();
    renderDishes(1);
}

async function renderDishes(pageNumber) {
    let requestString = get_request_string(pageNumber);

    await fetch(requestString)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw Error(response.status.toString());
            }
        })
        .then(json => {
            let dishes = json['dishes'];
            let pagination = json['pagination'];

            for (let i = 0; i < dishes.length; i++) {
                renderCard(dishes[i]);
            }

        })
        .catch(statusCode => {
        })
    inBasketCheck()
    changeMainAmount()
}

function renderCard(dish) {
    let template = $('#card_template');
    let dishBlock = template.clone();

    dishBlock.attr('id', dish['id']);
    dishBlock.find('.title').text(`${dish['name']}`);
    dishBlock.find('.description').text(`${dish['description']}`);
    dishBlock.find(".btn-basket").attr("id", dish['id']);
    dishBlock.find(".button-minus-main").attr("id", dish['id']);
    dishBlock.find(".button-plus-main").attr("id", dish['id']);
    dishBlock.find('.price').text(`Цена - ${dish['price']}`);
    dishBlock.find('.category').text(`Категория блюда - ${convertCategoryEngToRus(dish['category'])}`);
    dishBlock.find('.card-img-top').prop('src', dish['image']);
    dishBlock.find(".card-img-top").attr("dish_id", dish['id']);
    if (dish['vegetarian']){
        dishBlock.find(".img-vegetarian").removeClass("d-none");
    }

    dishBlock.find('.card-img-top').on('click', function () {
        let id = $(this).attr("dish_id");
        location.href = '/item/index.html#' + id
    })

    if(localStorage.getItem('token') == null){
        dishBlock.find('.btn-basket').addClass('d-none')
    }

    dishBlock.removeClass('d-none');
    $('#card_container').append(dishBlock);

    let options = menuStarRatingOptions(dish['rating']);

    $(`#${dish['id']}`).find('.rating').starRating(options);
}

async function inBasketCheck()
{
    let token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`${URL}/api/basket`, {
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
                $("div[id=" + dish.id + "]").each(function() {
                    $(this).find(".btn-basket").addClass("d-none");
                    $(this).find(".change-amount").removeClass("d-none");
                    $(this).find(".item-count-main").text(dish.amount);
                })
            }
        })
        .catch((error) => {
            console.log(error);
        })
}

function changeMainAmount()
{
    $(".button-plus-main, .btn-basket").on('click', async function(e) {
        let id = $(this).attr("id");
        let token = localStorage.getItem("token");
        if (!token) return;
        await fetch(`${URL}/api/basket/dish/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .catch((error) => { console.log(error); })

        $("div[id=" + this.getAttribute("id") + "]").each(function() {
            let count = $(this).find(".item-count-main").text();
            if (!count) {
                count = 0;
            }
            $(this).find(".btn-basket").addClass("d-none");
            $(this).find(".change-amount").removeClass("d-none");
            $(this).find(".item-count-main").text(parseInt(count) + 1);
        })
    })

    $(".button-minus-main").on('click', async function(e) {
        let token = localStorage.getItem("token");
        let id = $(this).attr("id");
        if (!token) return;
        await fetch(`${URL}/api/basket/dish/${id}?increase=true`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .catch((error) => { console.log(error); })

        $("div[id=" + this.getAttribute("id") + "]").each(function() {
            let count = $(this).find(".item-count-main").text();
            if (parseInt(count) === 1) {
                $(this).find(".btn-basket").removeClass("d-none");
                $(this).find(".change-amount").addClass("d-none");
            }
            $(this).find(".item-count-main").text(parseInt(count) - 1);
        })
    })
}


