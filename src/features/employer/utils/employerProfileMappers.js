export const mapEmployerProfileResponseToForm = (profile) => ({
    email: profile?.email || "",
    password: "",
    passwordConfirm: "",
});

export const mapEmployerProfileFormToDto = (formData, initialFormData = {}) => {
    const dto = {};

    if (formData.email !== initialFormData.email) {
        dto.email = formData.email;
    }

    if (formData.password) {
        dto.password = formData.password;
        dto.passwordConfirm = formData.passwordConfirm;
    }

    return dto;
};
