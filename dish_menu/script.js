import changeNavbar from '../navbar/navbar_changing.js'
import {getRequestString} from "./get_request_string.js";
import {convertCategoryEngToRus} from "./converter.js";
import {menuStarRatingOptions} from "/helpers/config.js";
import URL from "../helpers/url.js";

$(document).ready(() => {
    changeNavbar('menu')
    $('.selectpicker').selectpicker();
    $('#btn-execute').on('click', handleForSubmit);
    firstRender();
});

function firstRender() {
    let isFirstPage = false

    let currentPage = localStorage.getItem('currentPage')
    if (window.history.length < 2 || currentPage === null) {
        currentPage = 1;
        localStorage.setItem('currentPage', currentPage.toString())
        localStorage.removeItem('params')
        isFirstPage = true
    }

    let params = JSON.parse(localStorage.getItem('params'))

    if (params !== null) {
        renderParams(params);
    }

    handleForSubmit(isFirstPage);
}

function renderParams(params) {
    let categories = params.categories;
    if (categories[0] !== null && categories[0] !== undefined) {
        for (let i = 0; i < categories.length; i++) {
            $('#category-col').find('.btn').click()
            switch (categories[i]) {
                case 'Wok':
                    $('#bs-select-1-0').click();
                    break;
                case 'Pizza':
                    $('#bs-select-1-1').click();
                    break;
                case 'Soup':
                    $('#bs-select-1-2').click();
                    break;
                case 'Dessert':
                    $('#bs-select-1-3').click();
                    break;
                case 'Drink':
                    $('#bs-select-1-4').click();
                    break;
            }
            $('#category-col').find('.btn').click()
        }
    }

    $('#sort_col').find('.dropdown-toggle').click();
    switch (params.sort) {
        case 'NameAsc':
            $('#bs-select-2-0').click();
            break;
        case 'NameDesc':
            $('#bs-select-2-1').click();
            break;
        case 'PriceAsc':
            $('#bs-select-2-2').click();
            break;
        case 'PriceDesc':
            $('#bs-select-2-3').click();
            break;
        case 'RatingAsc':
            $('#bs-select-2-4').click();
            break;
        case 'RatingDesc':
            $('#bs-select-2-5').click();
            break;
    }
    $('#sort_col').find('.dropdown-toggle').click();


    if (params.isVegan === true){
        $('#vegan_switch').click();
    }
}

function handleForSubmit(isFirstPage) {
    $('#card_container').empty();
    $('#pagination-buttons').empty();

    localStorage.removeItem('params');

    let currentPage = localStorage.getItem('currentPage');

    if (currentPage === null) {
        currentPage = 1;
        localStorage.setItem('currentPage', currentPage.toString());
    }

    if (isFirstPage === true){
        currentPage = 1;
    }

    console.log()
    let reqStr = getRequestString(currentPage);
    console.log(reqStr);
    fetch(reqStr)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw Error(response.status.toString());
            }
        })
        .then(json => {
            localStorage.setItem('currentPage', json['pagination']['current']);
            localStorage.setItem('pageCount', json['pagination']['count']);
            renderDishes(json['dishes']);
            renderPaginationButtons(json['pagination']);
        })
        .catch(error => {
            localStorage.setItem('currentPage', '1');
            handleForSubmit(false);
        })

}

function renderDishes(dishes) {
    for (let dish of dishes) {
        renderCard(dish);
    }
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

function renderPaginationButtons(pagination) {
    renderNumberedBtn(pagination);
    renderArrowBtn();
}

function renderNumberedBtn(pagination) {
    if (Number(pagination['current']) > 1) {
        //рисуем предыдущую
        let prevBtn = $('#default-btn').clone();
        prevBtn.text(Number(pagination['current']) - 1);
        $('#pagination-buttons').append(prevBtn);
        prevBtn.on('click', () => {
            localStorage.setItem('currentPage', prevBtn.text());
            handleForSubmit();
        })
    }

    //рисуем текущую страницу
    let currentBtn = $('#active-btn').clone();
    currentBtn.text(pagination['current']);
    $('#pagination-buttons').append(currentBtn);

    if (Number(pagination['current']) < Number(pagination['count'])) {
        //рисуем следующую
        let nextBtn = $('#default-btn').clone();
        nextBtn.text(Number(Number(pagination['current']) + 1));
        $('#pagination-buttons').append(nextBtn);

        nextBtn.on('click', () => {
            localStorage.setItem('currentPage', nextBtn.text());
            handleForSubmit();
        })
    }
}

function renderArrowBtn() {
    let leftBtn = $('#left-btn').clone();
    let rightBtn = $('#right-btn').clone();

    $('#pagination-buttons').append(rightBtn);
    $('#pagination-buttons').prepend(leftBtn);

    leftBtn.on('click', () => {
        let currentPage = Number(localStorage.getItem('currentPage'));

        if (currentPage > 1) {
            localStorage.setItem('currentPage', (currentPage - 1).toString());
            handleForSubmit();
        }
    });

    rightBtn.on('click', () => {
        let currentPage = Number(localStorage.getItem('currentPage'));

        if (currentPage < localStorage.getItem('pageCount')) {
            localStorage.setItem('currentPage', (currentPage + 1).toString());
            handleForSubmit();
        }

    });

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


