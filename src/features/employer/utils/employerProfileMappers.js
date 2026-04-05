export const mapEmployerProfileResponseToForm = (profile) => ({
    email: profile?.email || "",
    password: "",
    passwordConfirm: "",
});

export const mapEmployerProfileFormToDto = (formData) => ({
    email: formData.email,
    password: formData.password,
    passwordConfirm: formData.passwordConfirm,
});