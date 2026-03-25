export const mapStudentRegisterToDto = (formData) => ({
  name: formData.firstName,
  surname: formData.lastName,
  email: formData.email,
  password: formData.password,
  passwordConfirm: formData.passwordConfirm,
});

export const mapEmployerRegisterToDto = (formData) => ({
  email: formData.email,
  companyName: formData.companyName,
  inn: formData.inn,
  password: formData.password,
  passwordConfirm: formData.passwordConfirm,
});

export const mapLoginToDto = (formData) => ({
  email: formData.email,
  password: formData.password,
});