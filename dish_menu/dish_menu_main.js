$(document).ready(() => {
    $('.selectpicker').selectpicker();
    $(".my-rating").starRating({
        initialRating: 5,
        totalStars: 10,
        strokeWidth: 0,
        starSize: 20,
        useGradient: false,
        disableAfterRate: true,
        readOnly: true,
        emptyColor: '#000000',
        activeColor: '#ffd700',
        callback: function (currentRating, $el) {
            console.log('событие');
        }
    });
});

