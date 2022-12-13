import changeNavbar from '../navbar/navbar_changing.js'
import get_request_string from '/dish_menu/get_request_string.js';
import {convertCategoryEngToRus} from "./converter.js";
import {menuStarRatingOptions} from "/helpers/config.js";

$(document).ready(() => {
    changeNavbar()
    $('.selectpicker').selectpicker();
    $('#btn-execute').on('click', handleForSubmit);
    handleForSubmit();
});

function handleForSubmit(event) {
    $('#card_container').empty();
    renderDishes(1);
}

function renderDishes(pageNumber) {
    let requestString = get_request_string(pageNumber);

    fetch(requestString)
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
}

function renderCard(dish) {
    let template = $('#card_template');
    let dishBlock = template.clone();

    dishBlock.attr('id', dish['id']);
    dishBlock.find('.title').text(`${dish['name']}`);
    dishBlock.find('.description').text(`${dish['description']}`);
    dishBlock.find('.price').text(`Цена - ${dish['price']}`);
    dishBlock.find('.category').text(`Категория блюда - ${convertCategoryEngToRus(dish['category'])}`);
    dishBlock.find('img').prop('src', dish['image']);
    dishBlock.find("img").attr("dish_id", dish['id']);

    dishBlock.find('img').on('click', function () {
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


