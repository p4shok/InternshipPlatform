export const validateStudentProfileForm = (formData) => {
    const errors = {};

    if (!formData.email.trim()) {
        errors.email = "Введите email";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        errors.email = "Введите корректный email";
    }

    if (!formData.name.trim()) {
        errors.name = "Введите имя";
    }

    if (!formData.surname.trim()) {
        errors.surname = "Введите фамилию";
    }

    if (formData.password && formData.password.length < 6) {
        errors.password = "Пароль должен содержать минимум 6 символов";
    }

    if (formData.password && formData.password !== formData.passwordConfirm) {
        errors.passwordConfirm = "Пароли не совпадают";
    }

    if (
        formData.graduationYear &&
        !/^\d{4}$/.test(String(formData.graduationYear))
    ) {
        errors.graduationYear = "Укажите год в формате YYYY";
    }

    return errors;
};