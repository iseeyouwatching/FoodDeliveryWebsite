
const EMAIL_REGEXP = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
const WITHOUT_SPACES_REGEXP = /^\S+$/
const ONE_DIGIT_REGEXP = /(?=.*?[0-9])/
const PHONE_NUMBER_REXEGXP = /^(\+7|7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/

function isValid() {
    let email = $('#userEmail').val()
    if (!isEmailValid(email)) {
        $('#userEmail').toggleClass('is-invalid', true)
        $('#userEmail+.invalid-feedback').text('Некорректный email')
        return false
    } else {
        $('#userEmail').removeClass('is-invalid')
    }

    let phoneNumber = $('#userPhoneNumber').val()
    if (!isPhoneNumberValid(phoneNumber)) {
        $('#userPhoneNumber').toggleClass('is-invalid', true)
        $('#userPhoneNumber+.invalid-feedback').text('Некорректный номер телефона')
        return false
    } else {
        $('#userPhoneNumber').removeClass('is-invalid')
    }

    let birthDate = $('#userBirthDate')
    if (Date.parse(`${birthDate.val()}T00:00:00`) > Date.now()) {
        $('#userBirthDate').toggleClass('is-invalid', true)
        $('#userBirthDate+.invalid-feedback').text('Некорректная дата рождения')
    } else {
        $('#userBirthDate').removeClass('is-invalid')
    }

    let password = $('#userPassword').val()
    if (password.length < 6) {
        $('#userPassword').addClass('is-invalid')
        $('#userPassword+.invalid-feedback').text('Пароль должен содержать минимум 6 символов')
        return false
    } else {
        $('#userPassword').removeClass('is-invalid')
    }
    if (!isWithoutSpaces(password)) {
        $('#userPassword').toggleClass('is-invalid', true)
        $('#userPassword+.invalid-feedback').text('Некорректный пароль, пароль не может содержать пробелы')
        return false
    } else {
        $('#userPassword').removeClass('is-invalid')
    }
    if (!isContainsOneDigit(password)) {
        $('#userPassword').toggleClass('is-invalid', true)
        $('#userPassword+.invalid-feedback').text('Пароль должен содержать хотя бы одну цифру')
        return false
    } else {
        $('#userPassword').removeClass('is-invalid')
    }
    if (password.length < 6) {
        $('#userPassword').addClass('is-invalid')
        $('#userPassword+.invalid-feedback').text('Пароль должен содержать минимум 6 символов')
        return false
    } else {
        $('#userPassword').removeClass('is-invalid')
    }


    return true
}

function isEmailValid(value) {
    return EMAIL_REGEXP.test(value)
}

function isPhoneNumberValid(value) {
    return PHONE_NUMBER_REXEGXP.test(value)
}

function isContainsOneDigit(value) {
    return ONE_DIGIT_REGEXP.test(value)
}

function isWithoutSpaces(value) {
    return WITHOUT_SPACES_REGEXP.test(value)
}

export default isValid