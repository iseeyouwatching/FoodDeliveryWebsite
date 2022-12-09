
const PHONE_NUMBER_REXEGXP = /^(\+7|7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/

function isValid() {
    var isValidForm = true
    $('[required]').each(function (indexFormInput, formInput) {
        if ($(formInput).val() === '') {
            $(formInput).addClass('is-invalid')
            isValidForm = false
            return false
        } else {
            $(formInput).removeClass('is-invalid')
        }
    })

    if (!isValidForm) {
        return false
    }

    let phoneNumber = $('#userPhoneNumber').val()
    if (!isPhoneNumberValid(phoneNumber)) {
        $('#userPhoneNumber').toggleClass('is-invalid', true)
        $('#userPhoneNumber+.invalid-feedback').text('Некорректный номер телефона')
        return false
    } else {
        $('#userPhoneNumber').removeClass('is-invalid')
    }

    let birthDate = $('.user-birthdate')
    if (Date.parse(`${birthDate.val()}T00:00:00`) > Date.now()) {
        $('.user-birthdate').toggleClass('is-invalid', true)
        $('.user-birthdate+.invalid-feedback').text('Некорректная дата рождения')
        return false
    } else {
        $('.user-birthdate').removeClass('is-invalid')
    }

    return true
}

function isPhoneNumberValid(value) {
    return PHONE_NUMBER_REXEGXP.test(value)
}

export default isValid