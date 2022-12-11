export const categoryEngToRus = {
    'Wok': 'WOK',
    'Pizza': 'Пицца',
    'Soup': 'Суп',
    'Dessert': 'Десерт',
    'Drink': 'Напитки'
}

export const categoryRusToEng = {
    'WOK': 'Wok',
    'Пицца': 'Pizza',
    'Суп': 'Soup',
    'Десерт': 'Dessert',
    'Напитки': 'Drink'
}

export const sortRusToEng = {
    'А-Я': 'NameAsc',
    'Я-А': 'NameDesc',
    'По возрастания цены': 'PriceAsc',
    'По убыванию цены': 'PriceDesc',
    'По возрастания рейтинга': 'RatingAsc',
    'По убыванию рейтинга': 'RatingDesc',
}

export function menuStarRatingOptions(rating) {
    return {
        initialRating: rating,
        totalStars: 10,
        strokeWidth: 0,
        starSize: 20,
        useGradient: false,
        disableAfterRate: true,
        readOnly: true,
        emptyColor: '#000000',
        activeColor: '#FFBF00',
        callback: function (currentRating, $el) {
            console.log('событие');
        }
    }
}