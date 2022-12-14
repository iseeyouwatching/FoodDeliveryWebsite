import URL from "../helpers/url.js";
import {convertSortRusToEng} from "./converter.js";
import {convertCategoriesRusToEng} from "./converter.js";

export  function getRequestString(page) {
    let data = serializeForm();

    localStorage.setItem('params', JSON.stringify(data));

    let categoriesStr = '';

    for (let i = 0; i < data.categories.length; i++) {
        if (data.categories[i] !== undefined) {
            if (i > 0 && data.categories[0] !== null) {
                categoriesStr += '&';
            }
            categoriesStr += `categories=${data.categories[i]}`;
        }
    }

    let sortStr = `sorting=${data.sort}`;
    let vegetarianStr = `vegetarian=${data.isVegan}`;

    let requestStr = `${URL}/api/dish?${vegetarianStr}&${sortStr}&page=${page}`;

    if (categoriesStr !== '') {
        requestStr = requestStr + '&' + categoriesStr;
    }

    return requestStr;
}


function serializeForm() {
    let sort = serializeSort();
    let categories = serializeCategories();
    let isVegan = $('#vegan_switch').is(':checked');

    return {
        sort: sort,
        categories: categories,
        isVegan: isVegan
    };
}

function serializeSort() {
    let sort = $('#sort_col').find('.filter-option-inner-inner').text();

    return convertSortRusToEng(sort);
}

function serializeCategories() {
    let stringCategories = $('#category-col').find('.filter-option-inner-inner').text();

    let categories = stringCategories.split(',');

    for (let i = 0; i < categories.length; i++) {
        categories[i] = categories[i].replaceAll(' ', '');
        categories[i] = categories[i].replaceAll(',', '');
    }

    return convertCategoriesRusToEng(categories);
}