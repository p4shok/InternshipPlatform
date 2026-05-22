export const mapStudentProfileResponseToForm = (profile) => ({
    email: profile?.email || "",
    name: profile?.name || "",
    surname: profile?.surname || "",
    password: "",
    passwordConfirm: "",
    patronymic: profile?.patronymic || "",
    birthdayDate: profile?.birthdayDate ? profile.birthdayDate.slice(0, 10) : "",
    phone: profile?.phone || "",
    vkLink: profile?.vkLink || "",
    tgLink: profile?.tgLink || "",
    maxLink: profile?.maxLink || "",
    githubLink: profile?.githubLink || "",
    university: profile?.university || "",
    specialization: profile?.specialization || "",
    graduationYear: profile?.graduationYear || "",
});

export const mapStudentProfileFormToDto = (formData, initialFormData = {}) => {
    const dto = {};

    const assignIfChanged = (fieldName, value) => {
        if (value !== initialFormData[fieldName]) {
            dto[fieldName] = value;
        }
    };

    assignIfChanged("email", formData.email);
    assignIfChanged("name", formData.name);
    assignIfChanged("surname", formData.surname);
    assignIfChanged("patronymic", formData.patronymic);
    assignIfChanged("birthdayDate", formData.birthdayDate || null);
    assignIfChanged("phone", formData.phone);
    assignIfChanged("vkLink", formData.vkLink);
    assignIfChanged("tgLink", formData.tgLink);
    assignIfChanged("maxLink", formData.maxLink);
    assignIfChanged("githubLink", formData.githubLink);

    if (formData.password) {
        dto.password = formData.password;
        dto.passwordConfirm = formData.passwordConfirm;
    }

    return dto;
};
