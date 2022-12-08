import changeNavbar from '../navbar/navbar_changing.js'

$(window).on('hashchange', function() {
    loadDishMenu()
})

$(document).ready(function () {
    loadDishMenu()
})

function loadDishMenu() {
    changeNavbar('dish')
    console.log("test")
}


