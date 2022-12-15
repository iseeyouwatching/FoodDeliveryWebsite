import {categoryEngToRus, categoryRusToEng} from "/helpers/config.js";
import {sortRusToEng} from "/helpers/config.js";

export function convertCategoryEngToRus(category) {
    return categoryEngToRus[category];
}

export function convertCategoriesRusToEng(categoryList){
    let result = [];
    for (let i = 0; i < categoryList.length; i++){
        if (categoryList[i] !== undefined){
            result.push(categoryRusToEng[categoryList[i]]);
        }
    }

    return result;
}

export function convertSortRusToEng(sort){
    return sortRusToEng[sort];
}

