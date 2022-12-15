import URL from '../helpers/url.js'

$('.log-out a').click(function (e) {
    console.log("logout")
    $('.are-you-sure').toggleClass('d-none', false)
    $('.are-you-sure').find('.yes').click(() => {
        fetch(`${URL}/api/account/logout`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(() => {
                localStorage.removeItem('token')
                location.reload()
            })

    })
    $('.are-you-sure').find('.no').click(() => {
        $('.are-you-sure').addClass('d-none')
    })
    e.preventDefault()
})