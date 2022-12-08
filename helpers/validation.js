$.validator.addMethod('dateLessCurrent', function(date) {
    return new Date(date) < new Date();
}, 'Введите корректную дату рождения');

$("form").validate({
    rules: {
        fullName: {
            required: true,
        },
        regPassword: {
            required: true,
            minlength: 6
        },
        email: {
            required: true,
            email: true,
        },
        gender: {
            required: true,
        },
        loginPassword: {
            required: true,
        },
        birthDate: {
            required: false,
            dateLessCurrent: true
        },
        phoneNumber: {
            required: true,
        },
    },
    messages: {
        fullName: {
            required: "Введите ФИО"
        },
        regPassword: {
            required: "Введите пароль",
            minlength: "Пароль не может быть меньше 6 символов"
        },
        email: {
            required: "Введите email",
            email: "Введите корректный email",
        },
        gender: {
            required: "Выберите пол",
        },
        loginPassword: {
            required: "Введите пароль",
        },
        phoneNumber: {
            required: "Введите номер телефона",
        },
    }
});