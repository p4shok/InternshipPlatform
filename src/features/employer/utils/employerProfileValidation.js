export const validateEmployerProfileForm = (formData) => {
    const errors = {};

    if (!formData.email.trim()) {
        errors.email = "Введите email";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        errors.email = "Введите корректный email";
    }

    if (formData.password && formData.password.length < 6) {
        errors.password = "Пароль должен содержать минимум 6 символов";
    }

    if (formData.password && formData.password !== formData.passwordConfirm) {
        errors.passwordConfirm = "Пароли не совпадают";
    }

    return errors;
};