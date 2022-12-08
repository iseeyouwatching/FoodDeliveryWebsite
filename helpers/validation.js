$('#form-log-in').validate({
    rules: {
        email: {
            required: true,
            email: true,
        },
        loginPassword: {
            required: true,
        }
        },
        messages: {
            email: {
                required: "Введите email",
                email: "Введите корректный email",
            },
            loginPassword: {
                required: "Введите пароль",
            },
        }
});