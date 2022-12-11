import {menuStarRatingOptions} from "/helpers/config.js";
import changeNavbar from '../navbar/navbar_changing.js'
import URL from "../helpers/url.js";
import {convertCategoryEngToRus} from "../dish_menu/converter.js";

$(document).ready(function () {
    changeNavbar()
    loadDishDetails(location.hash.substr(1))
})

function loadDishDetails(id) {
    fetch(`${URL}/api/dish/${id}`)
        .then((response) => {
            return response.json()
        })
        .then((json) => {
            let dish = $('#menu-position-template')
            let block = dish.clone()
            block.removeClass('d-none')

            block.attr('id', json.id);
            block.find('.dish-name').text(json.name)
            block.find('.dish-picture').attr('src', json.image)
            block.find('.dish-category').text(`Категория блюда - ${convertCategoryEngToRus(json.category)}`)
            if (json.vegetarian) {
                block.find('.dish-veg-or-not').text("Вегетарианское")
            }
            else {
                block.find('.dish-veg-or-not').text("Не вегетарианское")
            }
            block.find('.dish-description').text(json.description)

            let options = menuStarRatingOptions(json.rating);
            block.find('.dish-rating').starRating(options);

            block.find('.dish-price').text(json.price + ' руб./шт')

            $('#menu-position-template').replaceWith(block)

        })
}