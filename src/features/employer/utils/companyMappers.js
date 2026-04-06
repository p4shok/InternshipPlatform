export const mapCompanyResponseToForm = (company) => ({
    id: company?.id || "",
    name: company?.name || "",
    inn: company?.inn || "",
    link: company?.link || "",
    description: company?.description || "",
    logoUrl: company?.logoPath || "",
});

export const mapCompanyFormToDto = (formData) => ({
    name: formData.name,
    inn: formData.inn,
    link: formData.link,
    description: formData.description,
});