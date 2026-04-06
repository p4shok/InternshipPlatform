export const validateCompanyForm = (formData) => {
    const errors = {};

    if (!formData.name.trim()) {
        errors.name = "Введите название компании";
    }

    if (!formData.inn.trim()) {
        errors.inn = "Введите ИНН";
    } else if (!/^\d{10}(\d{2})?$/.test(formData.inn.trim())) {
        errors.inn = "ИНН должен содержать 10 или 12 цифр";
    }

    if (formData.link && !/^https?:\/\/\S+$/i.test(formData.link)) {
        errors.link = "Введите корректную ссылку, начиная с http:// или https://";
    }

    return errors;
};